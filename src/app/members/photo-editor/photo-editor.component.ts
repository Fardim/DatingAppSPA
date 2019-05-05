import { EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Output } from '@angular/core';
import { UserService } from 'src/app/_services/user.service';
import { AuthService } from './../../_services/auth.service';
import { Photo } from './../../_models/Photo';
import { Component, OnInit, Input } from '@angular/core';
import { FileUploader, FileUploaderOptions, FileItem } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { AlertifyService } from 'src/app/_services/alertify.service';
import * as _ from 'underscore';

@Component({
    selector: 'app-photo-editor',
    templateUrl: './photo-editor.component.html',
    styleUrls: ['./photo-editor.component.css']
})
export class PhotoEditorComponent implements OnInit {
    @Input() photos: Photo[];
    @Output() getMemberPhotoChange = new EventEmitter<string>();

    public uploader: FileUploader;
    public hasBaseDropZoneOver: boolean = false;
    baseUrl = environment.apiUrl;
    currentMain: Photo;

    constructor(
        private authService: AuthService,
        private userService: UserService,
        private alertify: AlertifyService,
        private changeDetector: ChangeDetectorRef
    ) {}

    ngOnInit() {
        this.initializeUploader();
    }

    public fileOverBase(e: any): void {
        this.hasBaseDropZoneOver = e;
    }

    initializeUploader() {
        this.uploader = new FileUploader({
            url:
                this.baseUrl +
                'users/' +
                this.authService.decodedToken.nameid +
                '/photos',
            authToken: 'Bearer ' + localStorage.getItem('token'),
            isHTML5: true,
            allowedFileType: ['image'],
            removeAfterUpload: true,
            autoUpload: false,
            maxFileSize: 10 * 1024 * 1024
        });

        this.uploader.onAfterAddingFile = file => {
            file.withCredentials = false; //To avoid cors error
        };
        this.uploader.onProgressItem = (fileItem: FileItem, progress: any) => {
            console.log(fileItem);
            console.log(progress);
        };
        this.uploader.onSuccessItem = (item, response, status, headers) => {
            if (response) {
                console.log('onSuccessItem', response);
                const res: Photo = JSON.parse(response);
                const photo: Photo = { ...res };
                console.log('pushphoto', photo);
                this.photos.push(photo);
                if (photo.isMain) {
                    this.authService.changeMemberPhoto(photo.url);
                    this.authService.currentUser.photoUrl = photo.url;
                    localStorage.setItem(
                        'user',
                        JSON.stringify(this.authService.currentUser)
                    );
                }
            }
        };
    }

    setMainPhoto(photo: Photo) {
        this.userService
            .setMainPhoto(this.authService.decodedToken.nameid, photo.id)
            .subscribe(
                next => {
                    this.currentMain = _.find(this.photos, { isMain: true });
                    this.currentMain.isMain = false;
                    photo.isMain = true;
                    this.getMemberPhotoChange.emit(photo.url);
                    this.authService.changeMemberPhoto(photo.url);
                    this.authService.currentUser.photoUrl = photo.url;
                    localStorage.setItem(
                        'user',
                        JSON.stringify(this.authService.currentUser)
                    );
                    this.alertify.success('Main Photo Updated');
                },
                error => {
                    this.alertify.error(error);
                }
            );
    }

    deletePhoto(id: number) {
        this.alertify.confirm(
            'Are you sure you want to delete this photo?',
            () => {
                this.userService
                    .deletePhoto(this.authService.decodedToken.nameid, id)
                    .subscribe(
                        next => {
                            this.photos.splice(
                                _.findIndex(this.photos, { id: id }),
                                1
                            );
                            this.alertify.success('Photo has been deleted');
                        },
                        error => {
                            this.alertify.error(error);
                        }
                    );
            }
        );
    }
}
