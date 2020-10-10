import {Router} from "express";
import MapCalendarController from "../controllers/MapCalendar";
import {checkRequestedLanguage} from "../middleware/checkRequestedLanguage";
import HeroController from "../controllers/HeroController";
import {checkJwt} from "../middleware/checkJwt";

const router = Router();


//--------------==-EVENTS-------------------
// Get all calendar events
// router.get("/events/", checkRequestedLanguage, MapCalendarController.listAllCalendarEvents);

router.get("/", checkRequestedLanguage, MapCalendarController.listAllCalendarEventsAndHeroes);

// Get on   e calendar event
router.get("/events/:id", MapCalendarController.getOneCalendarEventById);

//Create a new calendar event
router.post("/events/", [/* checkJwt, checkRequestedLanguage */], MapCalendarController.newCalendarEvent);

//Edit one calendar event
router.patch("/events/:id", [/* checkJwt */], MapCalendarController.editCalendarEvent);
router.put("/events/:id", [/* checkJwt */], MapCalendarController.editCalendarEvent);

//Delete one calendar event
router.delete("/events/:id", [/* checkJwt */], MapCalendarController.deleteCalendarEvent);


//-----------------HEROES----------------
// Get all calendar events
// router.get("/heroes/", checkRequestedLanguage, MapCalendarController.listAllCalendarHeroes);

// Get one calendar event
router.get("/heroes/:id", MapCalendarController.getOneCalendarHeroById);

//Create a new calendar event
router.post("/heroes/", [/* checkJwt, */ checkRequestedLanguage], MapCalendarController.newCalendarHero);

//Edit one calendar event
router.patch("/heroes/:id", [/* checkJwt */], MapCalendarController.editCalendarHero);
router.put("/heroes/:id", [/* checkJwt */], MapCalendarController.editCalendarHero);

//Delete one calendar event
router.delete("/heroes/:id", [/* checkJwt */], MapCalendarController.deleteCalendarHero);


export default router;

