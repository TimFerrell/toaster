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
        return doesExist;
    }

    public loadWebAnimationsPolyfill():void {
        let scriptTag = document.createElement('script');
        scriptTag.setAttribute('src', '../node_modules/web-animations-js/web-animations.min.js');
        scriptTag.setAttribute('id', 'webAnimationsPolyfill');
        document.getElementsByTagName('body')[0].appendChild(scriptTag);
        this.webAnimationsApiPolyfillLoaded = true;
    };

    /**
     * Gets the container. Creates it if it does not already exist, using provided options.
     * @param options
     */
    public getContainer(options?:IToasterOptions):Element {
        let internalOptions:IToasterOptions;

        // If no options provided, use the defaults.
        if(typeof(options) === "undefined") {
            internalOptions = new ToasterOptions();
        }else{
            internalOptions = options;
        }

        this.container = document.getElementById(internalOptions.containerId);

        if (this.container == null) {
            this.container = this.createContainer(internalOptions);
        }

        return this.container;
    }

    /**
     * Creates the Toaster container.
     * @param options
     * @returns {Element}
     */
    private createContainer(options:IToasterOptions):Element {
        this.container = document.createElement('div');
        this.container.classList.add(options.positionClass);
        this.container.setAttribute('id',options.containerId);
        this.container.setAttribute('aria-live','polite');
        this.container.setAttribute("role","alert");

        document.querySelector(options.containerTarget).appendChild(this.container);

        return this.container;
    }

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
        this.visibleNotifications.forEach(function (element:IToasterNotificationSubscription) {
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

interface IToasterNotificationSubscription {
    notificationInstance:Notification;
    notificationElement:Element;
}

class ToasterOptions implements IToasterOptions {
    toastClass:string = "toast";
    containerId:string = "toast-container";
    titleClass:string = "toast-title";
    messageClass:string = "toast-message";
    showDuration:Number = 1000;
    hideDuration:Number = 1000;
    timeout:Number = 1000;
    extendedTimeout:Number = 1000;
    positionClass:string = "top-right";
    containerTarget:string = "body";
}

interface IToasterOptions {
    toastClass:string;
    containerId:string;
    titleClass:string;
    messageClass:string;
    showDuration:Number;
    hideDuration:Number;
    timeout:Number;
    extendedTimeout:Number;
    positionClass:string;
    containerTarget:string;
}