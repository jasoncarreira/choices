// import 'bootstrap';
// import 'jquery';
import {Aurelia} from 'aurelia-framework';
import {LogManager} from 'aurelia-framework';
import {ConsoleAppender} from 'aurelia-logging-console';
import {UserService} from "./service/user-service";
import {LocalUserService} from "./service/local-user-service";
import {MaterializeFormValidationRenderer} from "./util/materialize-form-validation-renderer";

LogManager.addAppender(new ConsoleAppender());
LogManager.setLevel(LogManager.logLevel.debug);

export function configure(aurelia: Aurelia) {
  aurelia.use
    .standardConfiguration()
    // .developmentLogging()
    .plugin('aurelia-materialize-bridge', bridge => bridge.useAll() )
    .plugin('aurelia-resize')
    .plugin('aurelia-dialog')
    .plugin('aurelia-validatejs')
    .plugin('aurelia-validation');


  //Uncomment the line below to enable animation.
  //aurelia.use.plugin('aurelia-animator-css');

  //Anyone wanting to use HTMLImports to load views, will need to install the following plugin.
  //aurelia.use.plugin('aurelia-html-import-template-loader')

  aurelia.start().then(() => {
    aurelia.container.registerHandler(
      'materialize-form',
      container => container.get(MaterializeFormValidationRenderer));
    aurelia.container.registerSingleton(UserService, LocalUserService);
    aurelia.setRoot()
  });
}
