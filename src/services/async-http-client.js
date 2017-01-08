import {inject} from 'aurelia-framework';
import {HttpClient} from 'aurelia-http-client';
import Fixtures from './fixtures';
import {EventAggregator} from 'aurelia-event-aggregator';
import {LoginStatus} from './messages';

@inject(HttpClient, Fixtures, EventAggregator )
export default class AsyncHttpClient {

  constructor(httpClient, fixtures, ea) {
    this.http = httpClient;
    this.http.configure(http => {
      http.withBaseUrl(fixtures.baseUrl);
    });
    this.ea = ea;
  }

  get(url) {
    return this.http.get(url);
  }

  post(url, obj) {
    return this.http.post(url, obj);
  }

  delete(url) {
    return this.http.delete(url);
  }

  login(url, user) {
    this.authenticate(url, user).then(successStatus => {
      this.ea.publish(new LoginStatus(successStatus));
    }).catch(errorStatus => {
      this.ea.publish(new LoginStatus(errorStatus));
    });
  }
  authenticate(url, user) {
    return new Promise((resolve, reject) => {
      this.http.post(url, user).then(response => {
        const status = response.content;
        if (status.success) {
          localStorage.zwitscher = JSON.stringify(response.content);
          this.http.configure(configuration => {
            configuration.withHeader('Authorization', 'bearer ' + response.content.token);
          });
        }
        resolve(status);
      }).catch(error => {
        const status = {
          success: false,
          message: 'service not available'
        };
        reject(status);
      });
    });
  }

  clearAuthentication() {
    localStorage.zwitscher = null;
    this.http.configure(configuration => {
      configuration.withHeader('Authorization', '');
    });
  }

  isAuthenticated() {

    let authenticated = false;
    if (localStorage.zwitscher !== 'null') {
      authenticated = true;
      this.http.configure(http => {
        const auth = JSON.parse(localStorage.zwitscher);
        if (auth){ //TODO: Check why needs to be checked
          http.withHeader('Authorization', 'bearer ' + auth.token);
          this.ea.publish(new LoginStatus(auth));
        }
      });
    }
    return authenticated;
  }
}
