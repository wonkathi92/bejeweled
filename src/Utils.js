/*
 * The title screen consists of a background image and a
 * start button. When this button is pressed, and event is
 * emitted to itself, which is listened for in the top-level
 * application. When that happens, the title screen is removed,
 * and the game screen shown.
 */
import device;
import src.Enum as Enum;

/**
 * Returns a random float between `low` and `high`, high exclusive, or
 * between 0 and `low` if no `high` was passed.
 * @method randFloat
 * @return {float}
 */

 const GEM_score = 0;	
 const GEM_RED = 1;	
 const GEM_BLUE = 2;
 const GEM_GREEN = 3;	
 const GEM_PURPLE = 4;

 const BLOCK_SIZE = 132;

exports.randFloat = function (low, high) {
	if (high == null) {
		high = low;
		low = 0;
	}
	return low + ((high - low) * Math.random());
}

/**
 * Returns a random int between `low` and `high`, high exclusive, or
 * between 0 and `low` if no `high` was passed.
 * @method randInt
 * @return {int}
 */
exports.randInt = function (low, high) {
	return exports.randFloat(low, high) | 0;
}

exports.gameMode = Enum(
	'CHANLENGE_MODE',
	'TIMER_MODE',
	'ENDLESS_MODE'
);

exports.characterData_Score = {
    "0": { image: "resources/images/numbers/score_0.png" },
    "1": { image: "resources/images/numbers/score_1.png" },
    "2": { image: "resources/images/numbers/score_2.png" },
    "3": { image: "resources/images/numbers/score_3.png" },
    "4": { image: "resources/images/numbers/score_4.png" },
    "5": { image: "resources/images/numbers/score_5.png" },
    "6": { image: "resources/images/numbers/score_6.png" },
    "7": { image: "resources/images/numbers/score_7.png" },
    "8": { image: "resources/images/numbers/score_8.png" },
    "9": { image: "resources/images/numbers/score_9.png" },
    ",": { image: "resources/images/numbers/score_comma.png" }
 }

 exports.characterData_Timer = {
    "0": { image: "resources/images/numbers/timer_0.png" },
    "1": { image: "resources/images/numbers/timer_1.png" },
    "2": { image: "resources/images/numbers/timer_2.png" },
    "3": { image: "resources/images/numbers/timer_3.png" },
    "4": { image: "resources/images/numbers/timer_4.png" },
    "5": { image: "resources/images/numbers/timer_5.png" },
    "6": { image: "resources/images/numbers/timer_6.png" },
    "7": { image: "resources/images/numbers/timer_7.png" },
    "8": { image: "resources/images/numbers/timer_8.png" },
    "9": { image: "resources/images/numbers/timer_9.png" }
 }

 exports.instruction = '- Tap to swap 2 blocks on the board.\n\n- You score points by making chains of three or more of the same color block.\n\n- You score more bonus points by making chains continuously.'

