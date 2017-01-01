import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import ZwitscherService from '../../services/zwitscher-service';

@inject(ZwitscherService, Router)
export class GlobalTimeline {

  loggedInUser = {};
  tweetMessage = '';
  tweetImage = {};

  constructor(zs, router) {
    this.zwitscherService = zs;
    this.router = router;
    this.loggedInUser = this.zwitscherService.loggedInUser;
  }

  attached() {
    $('#tweetForm #camerabutton')
      .on('click', function (e) {
        $('#tweetForm #fileInput', $(e.target).parents()).click();
      });

    $('#tweetForm #fileInput').on('change', function (input) {
      var $preview = $('#tweetForm #imagePreview');
      if (this.files && this.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
          $('#tweetForm #imagePreview').attr('src', e.target.result);
          $('#imageSegment').attr('style', 'display: block');
        };

        reader.readAsDataURL(this.files[0]);
      } else {
        $('#tweetForm #imagePreview').removeAttr('src');
        $('#imageSegment').attr('style', 'display: none');
      }
    });

    $('#tweetForm #imagePreview')
      .on('click', function (e) {
        var $control = $('#tweetForm #fileInput');
        control.replaceWith($control.val('').clone(true));
        $('#tweetForm #imagePreview').removeAttr('src');
        $('#imageSegment').attr('style', 'display: none');
      });

    $('#tweetForm').on('submit', function () {
      $('#tweetForm').addClass('loading disabled');
    });
  }

  postTweet() {
    let tweet = {
      message: this.tweetMessage,
    };

    if (this.tweetImage && this.tweetImage.length > 0) {
      getBase64(this.tweetImage[0]).then(base64EncodedImage => {

        tweet.image = base64EncodedImage;
        this.zwitscherService.postTweet(tweet).then(postedTweet => {
          console.log('tweet posted');
          //https://github.com/aurelia/router/issues/201
          this.router.navigateToRoute('reload');
        }).catch(err => {
          console.log('tweet could not be posted');
        })
      }).catch(err => {
          console.log('error encoding image');
        });
    } else {
      this.zwitscherService.postTweet(tweet).then(postedTweet => {
        console.log('tweet posted');
        //https://github.com/aurelia/router/issues/201
        this.router.navigateToRoute('reload');
      }).catch(err => {
        console.log('tweet could not be posted');
      })
    }
  }
}

function getBase64(file) {
  return new Promise((resolve, reject) => {
    let reader = new FileReader();
    reader.onload = readerEvent => {
      const binaryString = readerEvent.target.result;
      const base64String = btoa(binaryString);
      resolve(base64String);
    };
    reader.onerror = error => {
      reject(null);
    };
    reader.readAsBinaryString(file);
  });
}
