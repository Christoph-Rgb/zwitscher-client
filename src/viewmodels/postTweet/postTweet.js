import {inject} from 'aurelia-framework';
import ZwitscherService from '../../services/zwitscher-service';
import {EventAggregator} from 'aurelia-event-aggregator';
import {TweetUpdate} from '../../services/messages';

@inject(ZwitscherService, EventAggregator)
export class GlobalTimeline {

  loggedInUser = {};
  tweetMessage = '';
  tweetImage = null;

  constructor(zs,ea) {
    this.zwitscherService = zs;
    this.eventAgregator = ea;
    this.loggedInUser = this.zwitscherService.loggedInUser;
  }

  attached() {
    initilizeUploadForm();
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
          // this.router.navigateToRoute('reload');
          this.eventAgregator.publish(new TweetUpdate({}));
          this.reinitializeUploadForm();
        }).catch(err => {
          console.log('tweet could not be posted');
        })
      }).catch(err => {
          console.log('error encoding image');
        });
    } else {
      this.zwitscherService.postTweet(tweet).then(postedTweet => {
        this.eventAgregator.publish(new TweetUpdate({}));
        this.reinitializeUploadForm();
      }).catch(err => {
        console.log('tweet could not be posted');
      })
    }
  }

  reinitializeUploadForm() {
    $('#tweetForm').removeClass('loading disabled');
    $('#tweetForm #imagePreview').attr('src', null);
    $('#imageSegment').attr('style', 'display: none');
    this.tweetImage = null;
    this.tweetMessage = '';
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

function initilizeUploadForm(){
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