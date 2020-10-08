import { combineReducers } from "redux";
import { authReducer } from "./authReducer";
import { calendarReduce } from "./calendarReducer";
import { uiReduce } from "./uiReducer";

export const rootReducer = combineReducers({

    ui: uiReduce,
    calendar: calendarReduce,
    auth: authReducer

})

