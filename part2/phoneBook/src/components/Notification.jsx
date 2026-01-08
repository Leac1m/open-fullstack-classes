const Notification = ({ messageInfo, handleResetNotification }) => {
  if (!messageInfo) return null;

  handleResetNotification();

  return (
    <div className={messageInfo.status === "info" ? "info" : "error"}>
      {messageInfo.message}
    </div>
  );
};

export default Notification;
