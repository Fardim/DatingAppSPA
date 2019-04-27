import { User } from './../../_models/User';
import { AlertifyService } from './../../_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    NgxGalleryOptions,
    NgxGalleryImage,
    NgxGalleryAnimation
} from 'ngx-gallery';
import { TabsetComponent } from 'ngx-bootstrap';

@Component({
    selector: 'app-member-detail',
    templateUrl: './member-detail.component.html',
    styleUrls: ['./member-detail.component.css']
})
export class MemberDetailComponent implements OnInit {
    user: User;
    galleryOptions: NgxGalleryOptions[];
    galleryImages: NgxGalleryImage[];
    @ViewChild('memberTabs') memberTabs: TabsetComponent;

    constructor(
        private userService: UserService,
        private alertify: AlertifyService,
        private route: ActivatedRoute
    ) {}

    ngOnInit() {
        // this.loadUser();
        this.route.data.subscribe(data => {
            this.user = data['user'];
        });
        this.route.queryParams.subscribe(params => {
            this.memberTabs.tabs[params['tab']].active = true;
        });

        this.galleryOptions = [
            {
                width: '100%',
                height: '500px',
                thumbnailsColumns: 4,
                imagePercent: 100,
                imageAnimation: NgxGalleryAnimation.Slide,
                preview: false
            }
        ];
        this.galleryImages = this.getImages();
    }

    selectTab(tabId: number) {
        this.memberTabs.tabs[tabId].active = true;
    }

    // loadUser() {
    //   this.userService.getUser(+this.route.snapshot.paramMap.get('id')).subscribe((user:User) => {
    //     this.user = user;
    //   }, error => {
    //     this.alertify.error(error);
    //   });
    // }

    getImages() {
        const imageUrls = [];
        for (let i = 0; i < this.user.photos.length; i++) {
            imageUrls.push({
                small: this.user.photos[i].url,
                medium: this.user.photos[i].url,
                big: this.user.photos[i].url,
                description: this.user.photos[i].description
            });
        }
        return imageUrls;
    }
}
