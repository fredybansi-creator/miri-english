// All topics in the order Miri does them. Level 1 (A2–B1) first, then level 2 (B1): a bit longer answers
// and new grammar (present perfect, past continuous, used to, if + will …).
// Used by the app (neu/app.js), the game (neu/welt/welt.js) and tools/check_content.mjs.
import travel from './travel.js';
import friends from './friends.js';
import doctor from './doctor.js';
import holiday from './holiday.js';
import cafe from './cafe.js';
import shopping from './shopping.js';
import work from './work.js';
import plans from './plans.js';
import home from './home.js';
import experiences from './experiences.js';
import opinions from './opinions.js';
import problems from './problems.js';

export const TOPICS = [travel, friends, doctor, holiday, cafe, shopping, work, plans, home, experiences, opinions, problems];
