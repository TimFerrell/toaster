var Toaster = (function () {
    function Toaster(options) {
        this.subscribers = [];
        this.webAnimationsApiPolyfillLoaded = false;
        this.container = null;
        this.listener = null;
        this.notificationId = null;
        this.notificationType = null;
        this.previousToast = null;
        this.options = options || new ToasterOptions();
        this.subscribers = [];
        return this;
    }
    /**
     * Checks if native web animations API exists.
     * @returns {boolean}
     */
    Toaster.prototype.doesNativeWebAnimationsAPIExist = function () {
        var doesExist = typeof document.createElement('div')["animate"] === "function";
        return doesExist;
    };
    /**
     * Loads the web animations API polyfill, if necessary.
     */
    Toaster.prototype.loadWebAnimationsPolyfill = function () {
        var scriptTag = document.createElement('script');
        scriptTag.setAttribute('src', '../node_modules/web-animations-js/web-animations.min.js');
        scriptTag.setAttribute('id', 'webAnimationsPolyfill');
        document.getElementsByTagName('body')[0].appendChild(scriptTag);
        this.webAnimationsApiPolyfillLoaded = true;
    };
    ;
    /**
     * Gets the container. Creates it if it does not already exist, using provided options.
     * @param options
     */
    Toaster.prototype.getContainer = function (options) {
        // If no options provided, use the defaults.
        if (typeof (options) !== "undefined") {
            this.options = options;
        }
        this.container = document.getElementById(this.options.containerId);
        if (this.container == null) {
            this.container = this.createContainer(this.options);
        }
        return this.container;
    };
    /**
     * Creates the Toaster container.
     * @param options
     * @returns {Element}
     */
    Toaster.prototype.createContainer = function (options) {
        this.container = document.createElement('div');
        this.container.classList.add(options.positionClass);
        this.container.setAttribute('id', options.containerId);
        this.container.setAttribute('aria-live', 'polite');
        this.container.setAttribute("role", "alert");
        document.querySelector(options.containerTarget).appendChild(this.container);
        return this.container;
    };
    Toaster.prototype.notify = function (type, title, message) {
        var notificationInstance = new Notification();
        notificationInstance.NotificationType = type;
        notificationInstance.Title = title;
        notificationInstance.Message = message;
        var notificationElement = this.constructNotificationElement(type, title, message);
        if (this.container === null) {
            this.container = this.getContainer();
        }
        if (!(this.visibleNotifications instanceof Array)) {
            this.visibleNotifications = [];
        }
        this.visibleNotifications.push({
            notificationClass: notificationInstance,
            notificationElement: notificationElement
        });
        this.publish(notificationInstance, notificationElement);
        this.container.appendChild(notificationElement);
        return notificationElement;
    };
    Toaster.prototype.constructNotificationElement = function (type, title, message) {
        var toastClass;
        switch (type) {
            case ToasterNotificationType.ERROR:
                toastClass = "toaster-error";
                break;
            case ToasterNotificationType.INFO:
                toastClass = "toaster-info";
                break;
            case ToasterNotificationType.SNACKBAR:
                toastClass = "toaster-snackbar";
                break;
            case ToasterNotificationType.SUCCESS:
                toastClass = "toaster-success";
                break;
            case ToasterNotificationType.WARNING:
                toastClass = "toaster-warning";
                break;
        }
        var element = document.createElement('div');
        element.classList.add(this.options.toastClass);
        element.classList.add(toastClass);
        return element;
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
            //this.clearNotification(element.notificationInstance, element.notificationElement)
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
var ToasterNotificationType;
(function (ToasterNotificationType) {
    ToasterNotificationType[ToasterNotificationType["SUCCESS"] = 0] = "SUCCESS";
    ToasterNotificationType[ToasterNotificationType["INFO"] = 1] = "INFO";
    ToasterNotificationType[ToasterNotificationType["WARNING"] = 2] = "WARNING";
    ToasterNotificationType[ToasterNotificationType["ERROR"] = 3] = "ERROR";
    ToasterNotificationType[ToasterNotificationType["SNACKBAR"] = 4] = "SNACKBAR";
})(ToasterNotificationType || (ToasterNotificationType = {}));
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
var ToasterOptions = (function () {
    function ToasterOptions() {
        this.toastClass = "toast";
        this.containerId = "toast-container";
        this.titleClass = "toast-title";
        this.messageClass = "toast-message";
        this.showDuration = 1000;
        this.hideDuration = 1000;
        this.timeout = 1000;
        this.extendedTimeout = 1000;
        this.positionClass = "top-right";
        this.containerTarget = "body";
    }
    return ToasterOptions;
}());
