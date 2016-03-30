var Toaster = (function () {
    function Toaster(options) {
        this.subscribers = [];
        this.webAnimationsApiPolyfillLoaded = false;
        this.container = null;
        this.listener = null;
        this.notificationId = null;
        this.notificationType = null;
        this.previousToast = null;
        this.options = options;
        this.subscribers = [];
        return this;
    }
    Toaster.prototype.doesNativeWebAnimationsAPIExist = function () {
        var doesExist = typeof document.createElement('div')["animate"] === "function";
        console.log("Web Animations Exists:", doesExist);
        return doesExist;
    };
    Toaster.prototype.loadWebAnimationsPolyfill = function () {
        var scriptTag = document.createElement('script');
        scriptTag.setAttribute('src', '../node_modules/web-animations-js/web-animations.min.js');
        scriptTag.setAttribute('id', 'webAnimationsPolyfill');
        document.getElementsByTagName('body')[0].appendChild(scriptTag);
        this.webAnimationsApiPolyfillLoaded = true;
    };
    ;
    Toaster.prototype.notify = function (type, title, message) {
        var notificationInstance = new Notification();
        notificationInstance.NotificationType = type;
        notificationInstance.Title = title;
        notificationInstance.Message = message;
        var notificationElement = this.constructNotificationElement(type, title, message);
        if (!(this.visibleNotifications instanceof Array)) {
            this.visibleNotifications = [];
        }
        this.visibleNotifications.push({
            notificationClass: notificationInstance,
            notificationElement: notificationElement
        });
        this.publish(notificationInstance, notificationElement);
    };
    Toaster.prototype.constructNotificationElement = function (type, title, message) {
    };
    Toaster.prototype.publish = function (notificationInstance, notificationElement) {
        this.subscribers.forEach(function (subscriber) {
            subscriber.call(notificationInstance, notificationElement);
        });
    };
    Toaster.prototype.subscribe = function (callback) {
        if (!(this.subscribers instanceof Array)) {
            this.subscribers = [];
        }
        this.subscribers.push(callback);
    };
    Toaster.prototype.clearAllNotifications = function (options) {
        switch (options) {
            case "IMMEDIATE":
                this.clearAllNotificationsImmediately();
                break;
            case "ANIMATE_OUT":
                this.clearAllNotificationsWithAnimations();
                break;
        }
    };
    /**
     * Clears all notifications immediately without animating.
     */
    Toaster.prototype.clearAllNotificationsImmediately = function () {
        this.archivedNotifications.push(this.visibleNotifications);
        this.visibleNotifications = [];
    };
    /**
     * Clears all notifications, animating them out.
     */
    Toaster.prototype.clearAllNotificationsWithAnimations = function () {
        this.visibleNotifications.forEach(function (element) {
            this.clearNotification(element.notificationInstance, element.notificationElement);
        });
    };
    Toaster.prototype.clearNotification = function () {
    };
    return Toaster;
}());
var Notification = (function () {
    function Notification() {
    }
    return Notification;
}());
var NotificationType;
(function (NotificationType) {
    NotificationType[NotificationType["SUCCESS"] = 0] = "SUCCESS";
    NotificationType[NotificationType["INFO"] = 1] = "INFO";
    NotificationType[NotificationType["WARNING"] = 2] = "WARNING";
    NotificationType[NotificationType["ERROR"] = 3] = "ERROR";
    NotificationType[NotificationType["DEBUG"] = 4] = "DEBUG";
})(NotificationType || (NotificationType = {}));
var NotificationEvent;
(function (NotificationEvent) {
    NotificationEvent[NotificationEvent["ANIMATE_IN"] = 0] = "ANIMATE_IN";
    NotificationEvent[NotificationEvent["ANIMATE_OUT"] = 1] = "ANIMATE_OUT";
    NotificationEvent[NotificationEvent["SHOWING"] = 2] = "SHOWING";
    NotificationEvent[NotificationEvent["HOVERING"] = 3] = "HOVERING";
})(NotificationEvent || (NotificationEvent = {}));
var NotificationClearMethod;
(function (NotificationClearMethod) {
    NotificationClearMethod[NotificationClearMethod["IMMEDIATE"] = 0] = "IMMEDIATE";
    NotificationClearMethod[NotificationClearMethod["ANIMATE_OUT"] = 1] = "ANIMATE_OUT";
})(NotificationClearMethod || (NotificationClearMethod = {}));
