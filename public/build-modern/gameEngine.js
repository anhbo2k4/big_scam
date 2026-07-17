/**
 * ================================================
 * GAME ENGINE - Core game logic for all types
 * ================================================
 */

class GameEngine {
  constructor(sessionCode, gameType, config) {
    this.sessionCode = sessionCode;
    this.gameType = gameType;
    this.config = config;
    this.isPlaying = true;
    this.startTime = Date.now();
    this.state = {};
    this.selectedPrize = null;
    this.result = null;
  }

  /**
   * Calculate completion time
   */
  getCompletionTime() {
    return Math.floor((Date.now() - this.startTime) / 1000);
  }

  /**
   * End game and save result
   */
  async endGame(prizeIndex) {
    this.isPlaying = false;
    this.selectedPrize = prizeIndex;
    this.result = {
      session_code: this.sessionCode,
      selected_prize: prizeIndex,
      completion_time_seconds: this.getCompletionTime(),
      timestamp: new Date().toISOString()
    };

    try {
      // Save result to server
      const response = await fetch('/api/game/result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.result)
      });

      return await response.json();
    } catch (err) {
      console.error('❌ Error saving game result:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Share game result
   */
  async shareResult() {
    try {
      // Update share count
      const response = await fetch(`/api/game/${this.sessionCode}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prize_index: this.selectedPrize })
      });

      if (navigator.share) {
        await navigator.share({
          title: 'GiftBox Game',
          text: `I just won prize #${this.selectedPrize + 1}! 🎁`,
          url: `${window.location.origin}/play/${this.sessionCode}`
        });
      } else {
        // Fallback: copy to clipboard
        const url = `${window.location.origin}/play/${this.sessionCode}`;
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
      }

      return response.json();
    } catch (err) {
      console.error('❌ Error sharing:', err);
    }
  }
}

console.log('✅ Game Engine loaded');
