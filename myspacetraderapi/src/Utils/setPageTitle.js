import { PAGE_TITLE } from "../Constants";

export default function setPageTitle(a) {
    if (document) {
        if (!a) {
            document.title = PAGE_TITLE;
            return;
        }

        let _a = ""+a;
        
        if (_a === "") document.title = PAGE_TITLE;
        else document.title = PAGE_TITLE+" - "+_a;
    }
}