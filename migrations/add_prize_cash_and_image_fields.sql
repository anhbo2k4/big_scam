-- Migration: Add prize cash and image fields to game_sessions table
-- Date: 2026-02-08

ALTER TABLE game_sessions 
ADD COLUMN prize_1_cash BOOLEAN DEFAULT FALSE AFTER prize_1_is_special,
ADD COLUMN prize_2_cash BOOLEAN DEFAULT FALSE AFTER prize_2_is_special,
ADD COLUMN prize_3_cash BOOLEAN DEFAULT FALSE AFTER prize_3_is_special,
ADD COLUMN prize_1_cash_amount INT DEFAULT NULL AFTER prize_1_cash,
ADD COLUMN prize_2_cash_amount INT DEFAULT NULL AFTER prize_2_cash,
ADD COLUMN prize_3_cash_amount INT DEFAULT NULL AFTER prize_3_cash,
ADD COLUMN prize_1_image_url LONGTEXT DEFAULT NULL AFTER prize_1_cash_amount,
ADD COLUMN prize_2_image_url LONGTEXT DEFAULT NULL AFTER prize_2_cash_amount,
ADD COLUMN prize_3_image_url LONGTEXT DEFAULT NULL AFTER prize_3_cash_amount;
