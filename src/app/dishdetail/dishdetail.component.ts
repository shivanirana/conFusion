import { Component, OnInit, ViewChild, Inject} from '@angular/core';
import { Dish } from '../shared/dish';
import  { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';

import { Comment } from '../shared/comment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss']
})
export class DishdetailComponent implements OnInit {
      
  @ViewChild('fform') commentFormDirective;

    dish: Dish;
    dishIds: string[];
    prev: string;
    next: string;

    comment:Comment;
    commentForm: FormGroup;

    formErrors = {
      'author': '',
      'comment': ''
    };
  
    validationMessages = {
      'author': {
        'required':      'Author Name is required.',
        'minlength':     'Author Name must be at least 2 characters long.',
      },
      'comment': {
        'required': 'Comment is required.',
      },
    };
  
           
   
  constructor(private dishservice: DishService, 
    private route: ActivatedRoute,
    private location: Location,
    private fb: FormBuilder,
    @Inject('BaseURL') private BaseURL) {
      this.createForm();
      
    }


    createForm() : void {
      this.commentForm = this.fb.group({
        author: ['', [Validators.required,Validators.minLength(2)]],
        rating: 5,
        comment: ['', Validators.required]
      });

      this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
      
    this.onValueChanged();
    }
    onValueChanged(data?: any) {
     
      if (!this.commentForm) { return; }
       
       
        for (const field in this.formErrors) {
        if (this.formErrors.hasOwnProperty(field)) {
          // clear previous error message (if any)
          this.formErrors[field] = '';
          const form = this.commentForm;
          const control = form.get(field);
          if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            for (const key in control.errors) {
              if (control.errors.hasOwnProperty(key)) {
                this.formErrors[field] += messages[key] + ' ';
                
              }
            }
          }
          this.comment = form.value;
        }
      }
      
    }
    onSubmit() {
      this.comment = this.commentForm.value;
    
      this.comment.date = new Date().toISOString();//to add current date
      this.dish.comments.push(this.comment);//to push the new comment in the comments section
      this.comment=null;
      this.commentForm.reset({
        author: '',
        comment: '',
        rating: 5
      });
      
      this.commentFormDirective.resetForm();
      this.createForm();// to reset value of slider
    }

  ngOnInit() {
    this.dishservice.getDishIds().subscribe(dishIds => this.dishIds = dishIds);
    this.route.params.pipe(switchMap((params: Params) => this.dishservice.getDish(params['id'])))
    .subscribe(dish => { this.dish = dish; this.setPrevNext(dish.id); });
  }
  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1) % this.dishIds.length];
    this.next = this.dishIds[(this.dishIds.length + index + 1) % this.dishIds.length];
  }

  goBack(): void {
    this.location.back();
  }
 
}
