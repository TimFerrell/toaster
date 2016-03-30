class Toaster {
    private container:Element;
    private listener;
    private notificationId:Number;
    private notificationType:NotificationType;
    private previousToast:Element;
    private options:Object;
    private visibleNotifications;
    private archivedNotifications;
    public subscribers = [];
    public webAnimationsApiPolyfillLoaded:boolean = false;

    public constructor(options) {
        this.container = null;
        this.listener = null;
        this.notificationId = null;
        this.notificationType = null;
        this.previousToast = null;
        this.options = options;
        this.subscribers = [];
        return this;
    }

    public doesNativeWebAnimationsAPIExist():boolean {
        let doesExist = typeof document.createElement('div')["animate"] === "function";
        console.log("Web Animations Exists:", doesExist);
        return doesExist;
    };

    public loadWebAnimationsPolyfill():void {
        let scriptTag = document.createElement('script');
        scriptTag.setAttribute('src', '../node_modules/web-animations-js/web-animations.min.js');
        scriptTag.setAttribute('id', 'webAnimationsPolyfill');
        document.getElementsByTagName('body')[0].appendChild(scriptTag);
        this.webAnimationsApiPolyfillLoaded = true;
    };

    public notify(type, title, message):void {

        let notificationInstance = new Notification();
        notificationInstance.NotificationType = type;
        notificationInstance.Title = title;
        notificationInstance.Message = message;

        let notificationElement = this.constructNotificationElement(type, title, message);

        if (!(this.visibleNotifications instanceof Array)) {
            this.visibleNotifications = []
        }

        this.visibleNotifications.push({
            notificationClass: notificationInstance,
            notificationElement: notificationElement
        });

        this.publish(notificationInstance, notificationElement);

    }

    private constructNotificationElement(type, title, message):void {

    }

    private publish(notificationInstance, notificationElement) {
        this.subscribers.forEach(function (subscriber:Function) {
            subscriber.call(notificationInstance, notificationElement)
        });
    }

    public subscribe(callback:Function) {
        if (!(this.subscribers instanceof Array)) {
            this.subscribers = []
        }
        this.subscribers.push(callback);
    }

    public clearAllNotifications(options:String):void {
        switch (options) {
            case "IMMEDIATE":
                this.clearAllNotificationsImmediately();
                break;
            case "ANIMATE_OUT":
                this.clearAllNotificationsWithAnimations();
                break;
        }
    }

    /**
     * Clears all notifications immediately without animating.
     */
    private clearAllNotificationsImmediately():void {
        this.archivedNotifications.push(this.visibleNotifications);
        this.visibleNotifications = [];
    }

    /**
     * Clears all notifications, animating them out.
     */
    private clearAllNotificationsWithAnimations():void {
        this.visibleNotifications.forEach(function (element) {
            this.clearNotification(element.notificationInstance, element.notificationElement)
        });
    }

    private clearNotification():void {

    }
}

class Notification {
    public Title:String;
    public Message:String;
    public NotificationType:NotificationType;
}

enum NotificationType {
    SUCCESS,
    INFO,
    WARNING,
    ERROR,
    DEBUG
}

enum NotificationEvent {
    ANIMATE_IN,
    ANIMATE_OUT,
    SHOWING,
    HOVERING
}

enum NotificationClearMethod {
    IMMEDIATE,
    ANIMATE_OUT
}

interface INotificationSubscription {
    event(notificationInstance:Notification, notificationElement:Element)
}