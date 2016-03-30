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
    constructor(options: any);
    doesNativeWebAnimationsAPIExist(): boolean;
    loadWebAnimationsPolyfill(): void;
    notify(type: any, title: any, message: any): void;
    private constructNotificationElement(type, title, message);
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
    NotificationType: NotificationType;
}
declare enum NotificationType {
    SUCCESS = 0,
    INFO = 1,
    WARNING = 2,
    ERROR = 3,
    DEBUG = 4,
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
interface INotificationSubscription {
    event(notificationInstance: Notification, notificationElement: Element): any;
}
