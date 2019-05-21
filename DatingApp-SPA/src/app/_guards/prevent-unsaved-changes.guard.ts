import { Injectable } from "@angular/core";
import { CanDeactivate } from "@angular/router";
import { MmeberEditComponent } from "../members/mmeber-edit/mmeber-edit.component";

@Injectable()

export class PreventUnsavedChanges implements CanDeactivate<MmeberEditComponent>{

canDeactivate(component:MmeberEditComponent){
    if(component.editform.dirty){
        return confirm('Are you sure you want to continue ? Any unsaved chnages will be lost !');
    }
    return true;
}

}