declare class Toaster {
    private container;
    private listener;
    private notificationId;
    private notificationType;
    private previousToast;
    private options;
    private visibleNotifications;
    private archivedNotifications;
    subscribers: any[];
    webAnimationsApiPolyfillLoaded: boolean;
    constructor(options?: IToasterOptions);
    /**
     * Checks if native web animations API exists.
     * @returns {boolean}
     */
    doesNativeWebAnimationsAPIExist(): boolean;
    /**
     * Loads the web animations API polyfill, if necessary.
     */
    loadWebAnimationsPolyfill(): void;
    /**
     * Gets the container. Creates it if it does not already exist, using provided options.
     * @param options
     */
    getContainer(options?: IToasterOptions): Element;
    /**
     * Creates the Toaster container.
     * @param options
     * @returns {Element}
     */
    private createContainer(options);
    notify(type: ToasterNotificationType, title: string, message: string): Element;
    private constructNotificationElement(type, title, message);
    private constructNotificationTitleElement(title);
    private constructNotificationMessageElement(message);
    private constructNotificationIconElement();
    private publish(notificationInstance, notificationElement);
    subscribe(callback: Function): void;
    clearAllNotifications(options: String): void;
    /**
     * Clears all notifications immediately without animating.
     */
    private clearAllNotificationsImmediately();
    /**
     * Clears all notifications, animating them out.
     */
    private clearAllNotificationsWithAnimations();
    private clearNotification();
}
declare class Notification {
    Title: String;
    Message: String;
    NotificationType: ToasterNotificationType;
}
declare enum ToasterNotificationType {
    SUCCESS = 0,
    INFO = 1,
    WARNING = 2,
    ERROR = 3,
    SNACKBAR = 4,
}
declare enum NotificationEvent {
    ANIMATE_IN = 0,
    ANIMATE_OUT = 1,
    SHOWING = 2,
    HOVERING = 3,
}
declare enum NotificationClearMethod {
    IMMEDIATE = 0,
    ANIMATE_OUT = 1,
}
interface IToasterNotificationSubscription {
    notificationInstance: Notification;
    notificationElement: Element;
}
declare class ToasterOptions implements IToasterOptions {
    toastClass: string;
    containerId: string;
    titleClass: string;
    messageClass: string;
    showDuration: Number;
    hideDuration: Number;
    timeout: Number;
    extendedTimeout: Number;
    positionClass: string;
    containerTarget: string;
}
interface IToasterOptions {
    toastClass: string;
    containerId: string;
    titleClass: string;
    messageClass: string;
    showDuration: Number;
    hideDuration: Number;
    timeout: Number;
    extendedTimeout: Number;
    positionClass: string;
    containerTarget: string;
}
