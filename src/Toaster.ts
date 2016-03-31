class Toaster {
    private container:Element;
    private listener;
    private notificationId:Number;
    private notificationType:ToasterNotificationType;
    private previousToast:Element;
    private options:IToasterOptions;
    private visibleNotifications;
    private archivedNotifications;
    public subscribers = [];
    public webAnimationsApiPolyfillLoaded:boolean = false;

    public constructor(options?:IToasterOptions) {
        this.container = null;
        this.listener = null;
        this.notificationId = null;
        this.notificationType = null;
        this.previousToast = null;
        this.options = options||new ToasterOptions();
        this.subscribers = [];
        return this;
    }

    /**
     * Checks if native web animations API exists.
     * @returns {boolean}
     */
    public doesNativeWebAnimationsAPIExist():boolean {
        let doesExist = typeof document.createElement('div')["animate"] === "function";
        return doesExist;
    }

    /**
     * Loads the web animations API polyfill, if necessary.
     */
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

        // If no options provided, use the defaults.
        if(typeof(options) !== "undefined") {
           this.options = options;
        }

        this.container = document.getElementById(this.options.containerId);

        if (this.container == null) {
            this.container = this.createContainer(this.options);
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

    public notify(type:ToasterNotificationType, title:string, message:string):Element {

        let notificationInstance = new Notification();
        notificationInstance.NotificationType = type;
        notificationInstance.Title = title;
        notificationInstance.Message = message;

        let notificationElement:Element = this.constructNotificationElement(type, title, message);

        if(this.container === null) {
            this.container = this.getContainer();
        }

        if (!(this.visibleNotifications instanceof Array)) {
            this.visibleNotifications = []
        }

        this.visibleNotifications.push({
            notificationClass: notificationInstance,
            notificationElement: notificationElement
        });

        this.publish(notificationInstance, notificationElement);

        this.container.appendChild(notificationElement);

        return notificationElement;
    }

    private constructNotificationElement(type:ToasterNotificationType, title, message):Element {
        let toastClass:string;
        switch(type) {
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

        let element = document.createElement('div');
            element.classList.add(this.options.toastClass);
            element.classList.add(toastClass);

        return element;
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
    public NotificationType:ToasterNotificationType;
}

enum ToasterNotificationType {
    SUCCESS,
    INFO,
    WARNING,
    ERROR,
    SNACKBAR
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