# Permission Matrix — Phase 1 Audit

> Project: `/var/www/big_scam`
> Scope: audit only; no feature, schema, or data changes.

## Findings

- Current authorization is mixed: `isAdmin`, `isAuthenticated`, and permission middleware.
- `hasPermission` currently grants every permission to `role === admin`; this preserves current admin full access.
- `routes/adminView.js` has admin pages protected by `isAdmin`.
- `routes/admin-config.js` applies `isAdmin` to entire router.
- `routes/chat.js` contains public/customer routes and protected admin chat routes; ownership/scope enforcement requires separate implementation audit.
- `/uploads` is served through `express.static` in `app.js`; sensitive attachment exposure risk.
- Realtime uses SSE and `utils/websocketHistory.js`; Socket.IO is disabled in `app.js`.

## Current authentication/authorization

| Area | Current guard | Risk/gap | Target permission |
|---|---|---|---|
| Admin dashboard `/admin` | `isAdmin` | Blocks non-admin regardless assigned permission | `admin` full; staff explicit permission |
| Admin views | `isAdmin` | Same | Per-page permission |
| User management API | `manage_users` | Permission exists; scope/admin identity not audited | `users.view/manage` + admin-only management |
| Permission API | `manage_permissions` | Management boundary needs cấp trên restriction | `permissions.manage` |
| Chat admin API | `requireChatAdminPermission` | Must verify session scope and assignment on every action | `chat.view/send/update/delete/assign` + scope |
| Prizes API | mixed/inspect route | CRUD and bulk actions need separate permissions | `prizes.view/create/update/delete` |
| Settings/config | `isAdmin` or `manage_permissions` | System-sensitive data | admin/system-only |
| Files/attachments | `/uploads` static; file API guarded partly | Direct URL bypass risk | scoped attachment route |
| SSE | route-specific or public | Event/session scope must be enforced | scoped stream permission |
| Audit logs | model exists | Read access matrix/route needs confirmation | `audit.view`; admin full |

## Route mounts

- `/admin` and `/admin/sessions` are defined in `app.js`.
- `/` mounts `routes/adminView.js`.
- `/api` mounts `routes/api.js`.
- `/api/game` mounts `routes/game.js`.
- `/api/chat` mounts `routes/chat.js`.
- `/api/games` mounts `routes/gamefeatures.js`.
- `/api/prizes` mounts `routes/prizes.js`.
- `/api/analytics` mounts `routes/analytics.js`.
- `/api/lucky-mystery-box` mounts `routes/lucky-mystery-box.js`.
- `/ui/fragments` mounts `routes/ui-fragments.js`.
- `/api/banks`, `/api/push`, `/api/wallet`, `/api/anticheat`, `/api/gamification`, `/api/admin/config` have separate mounts.

## Route files

`routes/adminView.js`, `admin-config.js`, `analytics.js`, `anticheat.js`, `api.js`, `banks.js`, `chat.js`, `gamefeatures.js`, `game.js`, `gamification.js`, `lucky-mystery-box.js`, `prizes.js`, `push.js`, `stream.js`, `ui-fragments.js`, `wallet.js`.

## Sensitive models

- `models/user.js`
- `models/permission.js`
- `models/chatsession.js`
- `models/chatmessage.js`
- `models/auditlog.js`
- `models/remembertoken.js`

## Data needing scope

| Data | Current identifiers | Required scope decision |
|---|---|---|
| Chat sessions/messages | `session_code`, `user_id`, `support_agent_id` | Add assignment/scope model without deleting old data |
| Customers | chat/session fields; admin-as-customer not separated | Separate display customer identity from actor identity |
| Game sessions | session/user fields | Scope query by server-derived grants |
| Prizes/redemptions | inspect model relations before migration | Scope according to owning session/user |
| Withdrawals/approvals | transaction/session/user fields | Permission + scope + audit |
| Audit logs | `user_id`, IP, user agent, details | Admin/internal read restriction |
| Attachments | `attachment_url`; public uploads | Protected download route; remove public exposure only after migration plan |

## Mandatory test inventory

- Authentication: unauthenticated, inactive user, remember token, session revoke.
- Pages/API: admin full access, staff granted scope, staff denied 403, direct URL/API/ID tampering.
- Chat: cross-agent read/send/edit/delete, attachment, SSE room/event leakage.
- Prizes: view/create/update/delete/bulk permission checks.
- Approval: view/approve/API tampering.
- Audit: actor/resource/timestamp and restricted audit reads.

## Phase 1 blockers before code

1. Confirm production DB dialect/storage from runtime environment without printing credentials.
2. Map every controller query for scope-capable records.
3. Identify existing migration runner and backup procedure.
4. Define permission codes and scope tables before migration.
