import Container from "typedi";
import { CategoryViewerTask } from "./categoryViewers";
import { TheaterTask } from "./theater";

export default [
    new TheaterTask(),
    new CategoryViewerTask()
];