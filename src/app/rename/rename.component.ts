import { Component, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Router } from '@angular/router';

import * as camera from "@nativescript/camera"
import { ImageAsset } from "@nativescript/core";
import { ImageSource, knownFolders} from '@nativescript/core';
import { flatMap, map } from 'rxjs/operators';
import { from } from 'rxjs';
import * as imagepicker from "@nativescript/imagepicker";
import { CategoryService } from '../category/category.service'
import { CategoryForm , QuestionForm, ChoiceForm} from '../category/category' 


@Component({
  selector: 'ns-rename',
  templateUrl: './rename.component.html',
  styleUrls: ["./rename.component.css"]
})
export class RenameComponent implements OnInit {
  CategoryID:number;
  QuestionID:number;
  ChoiceID:number;
  BackupData:string;
  SelectedData :string;
  NotQuestion:boolean;

  Image:string;
  GotImage:boolean ; 
  imagePath:string ;
  
  constructor( private categoryService :CategoryService, private route: ActivatedRoute, private router : Router) {}
  ngOnInit(): void {
    this.CategoryID = +this.route.snapshot.params.id
    this.QuestionID = +this.route.snapshot.params.questionId
    this.ChoiceID = +this.route.snapshot.params.choiceId
    console.log(this.CategoryID, this.QuestionID, this.ChoiceID)
    this.checkData()
  }
  // Check NaN with boolean will return False
  checkData(){
    if ( Boolean(this.QuestionID) == false && Boolean(this.ChoiceID) == false ){  
      var CategoryData = this.categoryService.getSelectedCategoryData(this.CategoryID)   
      this.SelectedData = CategoryData.name
      this.NotQuestion = true;
    }
    else if ( Boolean(this.QuestionID) === true && Boolean(this.ChoiceID) == false ) {
      var QuestionData = this.categoryService.getSelectedQuestionData(this.CategoryID, this.QuestionID)   
      this.SelectedData = QuestionData.question
      this.NotQuestion = false;
      console.log(QuestionData.imgPath)
      this.Image = QuestionData.imgPath
    }
    else { 
      var ChoiceData = this.categoryService.getSelectedChoiceData(this.CategoryID, this.QuestionID, this.ChoiceID)
      this.SelectedData = ChoiceData.choice 
      this.NotQuestion = true;
    }
    this.BackupData = this.SelectedData
    return this.SelectedData
  }
  
  edit(){
    if(this.SelectedData !="" && this.SelectedData != undefined){
      if( Boolean(this.QuestionID) == false && Boolean(this.ChoiceID) == false  ){
        this.categoryService.editCategoryName(this.CategoryID, this.SelectedData)
        this.router.navigate(['/detail',this.CategoryID]);
      }
      else if ( Boolean(this.QuestionID) === true && Boolean(this.ChoiceID) == false  ){
        this.categoryService.editQuestionName(this.CategoryID, this.QuestionID, this.SelectedData)
        this.categoryService.addNewImg(this.CategoryID, this.QuestionID, this.Image)
        this.router.navigate(['/detail',this.CategoryID, this.QuestionID]);
      }
      else {
        this.categoryService.editChoiceName(this.CategoryID, this.QuestionID, this.ChoiceID , this.SelectedData)
        this.router.navigate(['/detail',this.CategoryID, this.QuestionID]);
      }
    }
  }
  cancel(){
      if( Boolean(this.QuestionID) == false && Boolean(this.ChoiceID) == false  ){
        this.categoryService.editCategoryName(this.CategoryID, this.BackupData)
        this.router.navigate(['/detail',this.CategoryID]);
      }
      else if ( Boolean(this.QuestionID) === true && Boolean(this.ChoiceID) == false  ){
        this.categoryService.editQuestionName(this.CategoryID, this.QuestionID, this.BackupData)
        this.router.navigate(['/detail',this.CategoryID, this.QuestionID]);
      }
      else {
        this.categoryService.editChoiceName(this.CategoryID, this.QuestionID, this.ChoiceID , this.BackupData)
        this.router.navigate(['/detail',this.CategoryID, this.QuestionID]);
    }
  }
  getRandomString() {
    // random hash generator for generate file name
    var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var result = '';
    for ( var i = 0; i < 16; i++ ) {
        result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
    }
    return result;
}
  takePhoto(): void {
    if (!camera.isAvailable()) {
        throw new Error('Camera not available');
    }
    from(camera.requestPermissions()).pipe(
        flatMap(() => camera.takePicture()),
        flatMap((imageAsset: ImageAsset) => ImageSource.fromAsset(imageAsset)),
        map((imageSource: ImageSource) => {
            // set photo name and path get jpg 
            const fileName = this.getRandomString() + ".jpg";
            const photoFilePath = this.createPhotoPath(fileName);

            // save photo in full quality to file
            const success: boolean = imageSource.saveToFile(photoFilePath, 'jpg');
            if (!success) {
                throw new Error('Error during saving photo image to file ' + photoFilePath);
            }
            return photoFilePath;
        })
    ).subscribe(photoFilePath => {
        this.Image = photoFilePath
        this.GotImage = true; // set image visible
        console.log('Photofilepath ' + photoFilePath);
    }, error => {
        console.log(error);
    })
    }

    public pickPhoto() {
      let that = this;
      let context = imagepicker.create({
          mode: "multiple"
      });
      
      context
          .authorize()
          .then(function() {
              return context.present();
          })
          .then(function(selection) {
              selection.forEach(function(selected) {
                  // process the selected image
                  let source = ImageSource.fromAsset(selected)
                  source.then((imageSource: ImageSource) => {
                      // set photo name and path & save it
                      let fileName = that.getRandomString() + ".jpg";
                      const photoFilePath = that.createPhotoPath(fileName);
                      const success: boolean = imageSource.saveToFile(photoFilePath, 'jpg');

                      if (!success) {
                          throw new Error('Error during saving photo image to file ' + photoFilePath);
                      }
                      else {
                          // save successfully
                          that.imagePath = photoFilePath;
                          this.Image = photoFilePath
                          this.GotImage = true; // set image visible
                      }
                      return photoFilePath;
                  })
              })
          }).catch(function (e) {
              console.log(e);
          });
  }

    private createPhotoPath(fileName: string): string {
      const documentFolders = knownFolders.documents();
      if (!documentFolders) {
          throw new Error('Documents folder is not available');
      }

      // gets or creates photo folder
      let photoFolderPath;
      photoFolderPath = documentFolders.getFolder('images');

      // gets or creates empty file
      const photoFile = photoFolderPath.getFile(fileName);
      if (!photoFile) {
          throw new Error('Cannot create photo file');
      }
      return photoFile.path;
  }

  public photoViewer(src: string){
      this.router.navigate(['/photo', src ]);
  }
}
