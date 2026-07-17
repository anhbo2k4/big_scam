/**
 * cc-tiptap-editor.js
 * Shared rich text editor manager for the CSKH chat UI.
 *
 * Features:
 *  - Bold / Italic / Underline
 *  - Text colour
 *  - Font size
 *  - Floating bubble menu on text selection
 *  - Custom right-click context menu
 *  - Resizable main composer with localStorage persist
 *  - Paste rich text with cleanup
 *  - Paste image from clipboard and delegate upload through callback
 *  - Shared toolbar/context-menu for inline edit editors
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'cc_editor_size';
  const PASTE_ALLOWED_TAGS = new Set(['b', 'i', 'u', 'strong', 'em', 'span', 'br', 'p', 'div', 'ol', 'ul', 'li']);

  let _editorEl = null;
  let _wrapEl = null;
  let _bubbleEl = null;
  let _ctxEl = null;
  let _resizeHandle = null;
  let _hiddenInput = null;

  let _onSend = null;
  let _onInput = null;
  let _onPasteImage = null;
  let _activeEditor = null;
  let _docEventsBound = false;
  let _bubbleBound = false;
  let _ctxBound = false;

  const _managedEditors = new WeakMap();
  const _managedEditorList = [];

  const CcTiptap = {
    init({ onSend, onInput, onPasteImage } = {}) {
      _editorEl = document.getElementById('ccTiptapEditor');
      _wrapEl = document.getElementById('ccTiptapWrap');
      _bubbleEl = document.getElementById('ccTiptapBubble');
      _ctxEl = document.getElementById('ccTiptapCtx');
      _resizeHandle = document.getElementById('ccTiptapResizeHandle');
      _hiddenInput = document.getElementById('ccInput');
      _onSend = typeof onSend === 'function' ? onSend : null;
      _onInput = typeof onInput === 'function' ? onInput : null;
      _onPasteImage = typeof onPasteImage === 'function' ? onPasteImage : null;

      if (!_editorEl) return;

      if (_bubbleEl && _bubbleEl.parentElement !== document.body) {
        document.body.appendChild(_bubbleEl);
      }
      if (_ctxEl && _ctxEl.parentElement !== document.body) {
        document.body.appendChild(_ctxEl);
      }

      _registerManagedEditor(_editorEl, {
        syncHidden: true,
        submitOnEnter: true,
        onSend: _onSend,
        onInput: _onInput,
        onPasteImage: _onPasteImage
      });

      _restoreSize();
      _bindDocumentEvents();
      _bindBubbleMenu();
      _bindContextMenu();
      _bindResizeHandle();

      if (_wrapEl) {
        _wrapEl.addEventListener('click', (event) => {
          if (event.target === _wrapEl) {
            CcTiptap.focus(_editorEl, { atEnd: true });
          }
        });
      }
    },

    bindEditable(target, options = {}) {
      return _registerManagedEditor(_resolveEditor(target), {
        syncHidden: false,
        submitOnEnter: false,
        ...options
      });
    },

    unbindEditable(target) {
      _unregisterManagedEditor(_resolveEditor(target));
    },

    getActiveEditor() {
      return _getActiveEditor();
    },

    setActiveEditor(target) {
      _setActiveEditor(_resolveEditor(target));
    },

    getHTML(target) {
      const editor = _resolveEditor(target) || _editorEl;
      return editor ? String(editor.innerHTML || '').trim() : '';
    },

    getText(target) {
      const editor = _resolveEditor(target) || _editorEl;
      return editor ? String(editor.innerText || editor.textContent || '').trim() : '';
    },

    setHTML(html, target) {
      const editor = _resolveEditor(target) || _editorEl;
      if (!editor) return;
      editor.innerHTML = String(html || '').trim();
      _syncManagedEditor(editor);
    },

    clear(target) {
      const editor = _resolveEditor(target) || _editorEl;
      if (!editor) return;
      editor.innerHTML = '';
      _syncManagedEditor(editor);
    },

    focus(target, options = {}) {
      const editor = _resolveEditor(target) || _editorEl;
      if (!editor) return;
      _setActiveEditor(editor);
      editor.focus();
      if (options && options.atEnd) {
        _moveCaretToEnd(editor);
      }
    },

    isEmpty(target) {
      return !this.getText(target);
    },

    insertText(text, target) {
      const editor = _resolveEditor(target) || _getActiveEditor();
      if (!editor) return;
      this.focus(editor);
      document.execCommand('insertText', false, text);
      _syncManagedEditor(editor);
    },

    insertHTML(html, target) {
      const editor = _resolveEditor(target) || _getActiveEditor();
      if (!editor) return;
      this.focus(editor);
      _insertHtmlAtCursor(String(html || '').trim());
      _syncManagedEditor(editor);
    },

    exec(command, value, target) {
      const editor = _resolveEditor(target) || _getActiveEditor();
      if (!editor) return false;
      this.focus(editor);

      if (command === 'bold' || command === 'italic' || command === 'underline') {
        document.execCommand(command, false, null);
        _syncManagedEditor(editor);
        _refreshToolbarState();
        return true;
      }

      if (command === 'color') {
        document.execCommand('foreColor', false, value || '#f87171');
        _syncManagedEditor(editor);
        return true;
      }

      if (command === 'fontSize') {
        _applyFontSize(value, editor);
        _syncManagedEditor(editor);
        return true;
      }

      return false;
    }
  };

  function _registerManagedEditor(editor, options = {}) {
    if (!editor) return null;

    const normalizedOptions = {
      syncHidden: !!options.syncHidden,
      submitOnEnter: options.submitOnEnter !== false,
      onSend: typeof options.onSend === 'function' ? options.onSend : null,
      onInput: typeof options.onInput === 'function' ? options.onInput : null,
      onPasteImage: typeof options.onPasteImage === 'function' ? options.onPasteImage : null
    };

    const existing = _managedEditors.get(editor);
    if (existing) {
      existing.options = normalizedOptions;
      return editor;
    }

    const handlers = {
      focus: function () {
        _setActiveEditor(editor);
      },
      mouseup: function () {
        _setActiveEditor(editor);
      },
      keyup: function () {
        _setActiveEditor(editor);
      },
      input: function () {
        _setActiveEditor(editor);
        _syncManagedEditor(editor);
      },
      keydown: function (event) {
        _setActiveEditor(editor);
        const meta = _managedEditors.get(editor);
        if (!meta) return;
        if (event.key === 'Enter' && !event.shiftKey && meta.options.submitOnEnter && meta.options.onSend) {
          event.preventDefault();
          const html = String(editor.innerHTML || '').trim();
          if (html) meta.options.onSend(html, editor);
        }
      },
      paste: function (event) {
        _setActiveEditor(editor);
        const meta = _managedEditors.get(editor);
        if (!meta) return;

        const files = _extractClipboardImages(event);
        if (files.length && meta.options.onPasteImage) {
          event.preventDefault();
          meta.options.onPasteImage(files, editor);
          return;
        }
        if (files.length) return;

        const html = _normalizeClipboardRichText(event.clipboardData);
        if (!html) return;

        event.preventDefault();
        CcTiptap.insertHTML(html, editor);
      },
      contextmenu: function (event) {
        _setActiveEditor(editor);
        event.preventDefault();
        _showCtx(event.clientX, event.clientY);
      }
    };

    _managedEditors.set(editor, { options: normalizedOptions, handlers });
    _managedEditorList.push(editor);

    Object.keys(handlers).forEach(function (eventName) {
      editor.addEventListener(eventName, handlers[eventName]);
    });

    return editor;
  }

  function _unregisterManagedEditor(editor) {
    if (!editor) return;
    const meta = _managedEditors.get(editor);
    if (!meta) return;

    Object.keys(meta.handlers || {}).forEach(function (eventName) {
      editor.removeEventListener(eventName, meta.handlers[eventName]);
    });

    _managedEditors.delete(editor);
    const idx = _managedEditorList.indexOf(editor);
    if (idx >= 0) _managedEditorList.splice(idx, 1);

    if (_activeEditor === editor) {
      _activeEditor = _editorEl && _managedEditors.get(_editorEl) ? _editorEl : null;
      _refreshToolbarState();
    }
  }

  function _bindDocumentEvents() {
    if (_docEventsBound) return;
    _docEventsBound = true;

    document.addEventListener('selectionchange', _onSelectionChange);
    document.addEventListener('mousedown', function (event) {
      const target = event.target;
      if (_bubbleEl && _bubbleEl.contains(target)) return;
      if (_ctxEl && _ctxEl.contains(target)) return;
      if (_findManagedEditorFromNode(target)) return;
      _hideBubble();
      _hideCtx();
    });
  }

  function _onSelectionChange() {
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed || !selection.toString().trim()) {
      _hideBubble();
      return;
    }

    const editor = _findManagedEditorFromNode(selection.anchorNode) || _findManagedEditorFromNode(selection.focusNode);
    if (!editor) {
      _hideBubble();
      return;
    }

    _setActiveEditor(editor);
    _positionBubble(selection);
    _refreshToolbarState();
    if (_bubbleEl) _bubbleEl.style.display = 'flex';
  }

  function _positionBubble(selection) {
    if (!_bubbleEl) return;
    const range = selection.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    const bubbleWidth = _bubbleEl.offsetWidth || 240;
    const bubbleHeight = _bubbleEl.offsetHeight || 38;

    let left = rect.left + (rect.width / 2) - (bubbleWidth / 2);
    let top = rect.top - bubbleHeight - 8;

    if (top < 4) top = rect.bottom + 8;
    left = Math.max(8, Math.min(left, window.innerWidth - bubbleWidth - 8));

    _bubbleEl.style.left = `${left}px`;
    _bubbleEl.style.top = `${top}px`;
  }

  function _hideBubble() {
    if (_bubbleEl) _bubbleEl.style.display = 'none';
  }

  function _bindBubbleMenu() {
    if (_bubbleBound || !_bubbleEl) return;
    _bubbleBound = true;

    _bubbleEl.querySelectorAll('[data-tt]').forEach(function (btn) {
      if (btn.tagName !== 'BUTTON') return;
      btn.addEventListener('mousedown', function (event) {
        event.preventDefault();
        CcTiptap.exec(btn.dataset.tt, null, _getActiveEditor());
      });
    });

    const colorPicker = document.getElementById('ccTtColorPicker');
    if (colorPicker) {
      colorPicker.addEventListener('input', function () {
        CcTiptap.exec('color', colorPicker.value, _getActiveEditor());
        const icon = _bubbleEl.querySelector('.cc-tt-color-icon');
        if (icon) icon.style.setProperty('--cc-tt-cur-color', colorPicker.value);
      });
    }

    const fontSize = document.getElementById('ccTtFontSize');
    if (fontSize) {
      fontSize.addEventListener('change', function () {
        if (!fontSize.value) return;
        CcTiptap.exec('fontSize', fontSize.value, _getActiveEditor());
        fontSize.value = '';
      });
    }
  }

  function _bindContextMenu() {
    if (_ctxBound || !_ctxEl) return;
    _ctxBound = true;

    _ctxEl.querySelectorAll('[data-tt]').forEach(function (btn) {
      if (btn.tagName !== 'BUTTON') return;
      btn.addEventListener('mousedown', function (event) {
        event.preventDefault();
        CcTiptap.exec(btn.dataset.tt, null, _getActiveEditor());
        _hideCtx();
      });
    });

    const colorPicker = document.getElementById('ccCtxColorPicker');
    if (colorPicker) {
      colorPicker.addEventListener('input', function () {
        CcTiptap.exec('color', colorPicker.value, _getActiveEditor());
        _hideCtx();
      });
    }
  }

  function _showCtx(x, y) {
    if (!_ctxEl) return;
    _ctxEl.style.display = 'block';
    const width = _ctxEl.offsetWidth || 160;
    const height = _ctxEl.offsetHeight || 100;
    const left = Math.min(x, window.innerWidth - width - 6);
    const top = Math.min(y, window.innerHeight - height - 6);
    _ctxEl.style.left = `${Math.max(4, left)}px`;
    _ctxEl.style.top = `${Math.max(4, top)}px`;
  }

  function _hideCtx() {
    if (_ctxEl) _ctxEl.style.display = 'none';
  }

  function _refreshToolbarState() {
    if (!_bubbleEl) return;
    const activeEditor = _getActiveEditor();
    if (!activeEditor) return;

    ['bold', 'italic', 'underline'].forEach(function (command) {
      const button = _bubbleEl.querySelector(`[data-tt="${command}"]`);
      if (!button) return;
      let active = false;
      try {
        active = document.queryCommandState(command);
      } catch (_) {
        active = false;
      }
      button.classList.toggle('active', !!active);
    });
  }

  function _applyFontSize(size, editor) {
    const value = String(size || '').trim();
    if (!value) return;
    const selection = window.getSelection();
    if (!selection || selection.rangeCount === 0 || selection.isCollapsed) return;

    const range = selection.getRangeAt(0);
    if (!editor.contains(range.commonAncestorContainer)) return;

    const span = document.createElement('span');
    span.style.fontSize = value;

    try {
      range.surroundContents(span);
      selection.removeAllRanges();
      const nextRange = document.createRange();
      nextRange.selectNodeContents(span);
      selection.addRange(nextRange);
      return;
    } catch (_) {}

    const fragment = range.extractContents();
    span.appendChild(fragment);
    range.insertNode(span);
    const nextRange = document.createRange();
    nextRange.selectNodeContents(span);
    selection.removeAllRanges();
    selection.addRange(nextRange);
  }

  function _normalizeClipboardRichText(clipboardData) {
    if (!clipboardData) return '';
    const rawHtml = String(clipboardData.getData('text/html') || '').trim();
    const rawText = String(clipboardData.getData('text/plain') || '').replace(/\r\n?/g, '\n');

    if (rawHtml && !_shouldPreferPlainText(rawHtml)) {
      const cleanedHtml = _sanitizePastedHtml(rawHtml);
      if (cleanedHtml) return cleanedHtml;
    }

    return _plainTextToHtml(rawText);
  }

  function _shouldPreferPlainText(html) {
    const raw = String(html || '');
    if (!raw) return true;
    if (/class=(["'])?Mso/i.test(raw)) return true;
    if (/docs-internal-guid/i.test(raw)) return true;
    if (/<table[\s>]/i.test(raw)) return true;
    const noisyAttrs = (raw.match(/\s(?:class|style|lang|width|height|align|data-[\w-]+)=/gi) || []).length;
    return noisyAttrs >= 18;
  }

  function _sanitizePastedHtml(rawHtml) {
    const source = String(rawHtml || '').trim();
    if (!source) return '';

    const root = document.createElement('div');
    root.innerHTML = source;

    (function clean(node) {
      Array.from(node.childNodes).forEach(function (child) {
        if (child.nodeType === 8) {
          child.remove();
          return;
        }
        if (child.nodeType === 3) {
          child.textContent = String(child.textContent || '').replace(/\u00a0/g, ' ');
          return;
        }
        if (child.nodeType !== 1) {
          child.remove();
          return;
        }

        const tag = String(child.tagName || '').toLowerCase();
        if (['style', 'script', 'meta', 'link', 'iframe', 'object', 'embed', 'svg', 'canvas'].includes(tag)) {
          child.remove();
          return;
        }

        if (!PASTE_ALLOWED_TAGS.has(tag)) {
          while (child.firstChild) node.insertBefore(child.firstChild, child);
          child.remove();
          return;
        }

        Array.from(child.attributes).forEach(function (attr) {
          if (tag === 'span' && attr.name === 'style') {
            const safeStyle = String(attr.value || '')
              .split(';')
              .map(function (item) { return item.trim(); })
              .filter(function (item) { return /^(color|font-size)\s*:/i.test(item); })
              .join('; ');
            if (safeStyle) child.setAttribute('style', safeStyle);
            else child.removeAttribute('style');
            return;
          }
          child.removeAttribute(attr.name);
        });

        clean(child);

        if (tag === 'span' && !child.attributes.length && !child.querySelector('br')) {
          while (child.firstChild) node.insertBefore(child.firstChild, child);
          child.remove();
        }
      });
    })(root);

    return String(root.innerHTML || '')
      .replace(/<(p|div)>\s*<\/\1>/gi, '<br>')
      .replace(/(<br>\s*){3,}/gi, '<br><br>')
      .trim();
  }

  function _plainTextToHtml(text) {
    const raw = String(text || '').replace(/\u00a0/g, ' ').trim();
    if (!raw) return '';
    return raw
      .split(/\n{2,}/)
      .map(function (block) {
        return `<p>${_escapeHtml(block).replace(/\n/g, '<br>')}</p>`;
      })
      .join('');
  }

  function _escapeHtml(text) {
    return String(text || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function _insertHtmlAtCursor(html) {
    const content = String(html || '').trim();
    if (!content) return;

    try {
      document.execCommand('insertHTML', false, content);
      return;
    } catch (_) {}

    const selection = window.getSelection();
    if (!selection || !selection.rangeCount) return;
    const range = selection.getRangeAt(0);
    range.deleteContents();

    const fragment = range.createContextualFragment(content);
    const lastNode = fragment.lastChild;
    range.insertNode(fragment);
    if (lastNode) {
      range.setStartAfter(lastNode);
      range.collapse(true);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }

  function _extractClipboardImages(event) {
    const clipboardData = event && event.clipboardData;
    if (!clipboardData) return [];

    const files = [];
    Array.from(clipboardData.items || []).forEach(function (item) {
      if (!item || item.kind !== 'file') return;
      const file = item.getAsFile();
      if (!file) return;
      const mime = String(file.type || '').toLowerCase();
      if (mime.startsWith('image/')) files.push(file);
    });

    if (files.length) return files;

    return Array.from(clipboardData.files || []).filter(function (file) {
      const mime = String(file && file.type || '').toLowerCase();
      return mime.startsWith('image/');
    });
  }

  function _bindResizeHandle() {
    if (!_resizeHandle || !_wrapEl) return;

    let startY = 0;
    let startH = 0;

    _resizeHandle.addEventListener('mousedown', function (event) {
      event.preventDefault();
      startY = event.clientY;
      startH = _wrapEl.getBoundingClientRect().height;

      const onMove = function (moveEvent) {
        const nextHeight = Math.max(40, startH + (moveEvent.clientY - startY));
        _wrapEl.style.setProperty('height', `${nextHeight}px`, 'important');
        _wrapEl.style.setProperty('max-height', `${nextHeight}px`, 'important');
      };

      const onUp = function () {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        _saveSize();
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  function _saveSize() {
    if (!_wrapEl) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ h: _wrapEl.style.height }));
    } catch (_) {}
  }

  function _restoreSize() {
    if (!_wrapEl) return;
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (saved && saved.h) {
        _wrapEl.style.setProperty('height', saved.h, 'important');
        _wrapEl.style.setProperty('max-height', saved.h, 'important');
      }
    } catch (_) {}
  }

  function _syncManagedEditor(editor) {
    const meta = _managedEditors.get(editor);
    if (!meta) return;
    if (meta.options.syncHidden && _hiddenInput) {
      _hiddenInput.value = String(editor.innerHTML || '');
    }
    if (meta.options.onInput) {
      meta.options.onInput(editor);
    }
  }

  function _setActiveEditor(editor) {
    if (!editor || !_managedEditors.get(editor)) return;
    _activeEditor = editor;
    _refreshToolbarState();
  }

  function _getActiveEditor() {
    if (_activeEditor && _managedEditors.get(_activeEditor)) return _activeEditor;
    if (_editorEl && _managedEditors.get(_editorEl)) return _editorEl;
    return null;
  }

  function _resolveEditor(target) {
    if (!target) return null;
    if (typeof target === 'string') return document.querySelector(target);
    return target;
  }

  function _findManagedEditorFromNode(node) {
    if (!node) return null;
    const editors = _managedEditorList.filter(function (editor) {
      return editor && editor.isConnected && _managedEditors.get(editor);
    });
    for (let i = 0; i < editors.length; i += 1) {
      if (editors[i] === node || editors[i].contains(node)) return editors[i];
    }
    return null;
  }

  function _moveCaretToEnd(editor) {
    const selection = window.getSelection();
    if (!selection || !editor) return;
    const range = document.createRange();
    range.selectNodeContents(editor);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  window.CcTiptap = CcTiptap;
})();
