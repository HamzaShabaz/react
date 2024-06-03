import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser.jsx";
import { useTypewriterEffect } from "../../hooks/useTypewriterEffect.jsx";

const tableAttributes = [
  { name: "Agenda", value: "meeting", className: "task-title" },
  { name: "Description", value: "description", className: "task-description" },
  { name: "Time", value: "time", className: "task-time" },
  { name: "Reminder", value: "status", className: "task-status" },
];

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
  },
};

Modal.setAppElement("#root");

const MeetingModal = React.memo(({ isOpen, onRequestClose }) => {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [meetingDescription, setMeetingDescription] = useState("");
  const [time, setTime] = useState("");
  const [reminder, setReminder] = useState("");

  const { addMeetings, meetings } = useUser();

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const inputTime = new Date();
    const [hours, minutes] = time.split(":");
    inputTime.setHours(hours, minutes);

    if (!meetingTitle || !meetingDescription || !time) {
      MyToast("Please fill all field", "error");
      return;
    }

    if (inputTime < now) {
      console.error("Error task time cannot be in past");
      MyToast("The task cannot be in the past", "error");
      return;
    }
    const currentId = meetings?.[meetings?.length - 1]?.id + 1 || 1;
    addMeetings({
      meeting_title: meetingTitle,
      meeting_description: meetingDescription,
      time,
      reminder,
      id: currentId,
    });
    setMeetingTitle("");
    setMeetingDescription("");
    setTime("");
    setReminder("");
    onRequestClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <h2>Create Meeting</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={meetingTitle}
            onChange={(e) => setMeetingTitle(e.target.value)}
            className="input-modal-text"
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={meetingDescription}
            onChange={(e) => setMeetingDescription(e.target.value)}
            className="input-modal-text"
          />
        </div>
        <div>
          <label>Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="input-modal-text"
          />
        </div>
        <div>
          <label>Reminder</label>
          <input
            type="time"
            value={reminder}
            onChange={(e) => setReminder(e.target.value)}
            className="input-modal-text"
          />
        </div>
        <button
          type="submit"
          className="button-modal button-submit"
          disabled={!meetingTitle || !meetingDescription || !time || !reminder}
        >
          Save
        </button>
        <button
          type="button"
          onClick={onRequestClose}
          className="button-modal button-cancel"
        >
          Cancel
        </button>
      </form>
    </Modal>
  );
});

export const Meetings = () => {
  const { name, loggedIn, meetings } = useUser();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const typingEffect = useTypewriterEffect("Talk to AI and setup meetings");

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn, navigate]);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold mb-6">{name + "'"}s Meetings</h1>
        <div className="flex justify-between mb-6">
          <input
            type="text"
            placeholder={typingEffect}
            className="mr-2 px-2 py-1 border rounded col-9 col-xs-6"
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={openModal}
          >
            Add Meeting
          </button>
        </div>
        <div className="voucher-tabs">
          <div className="tab-content">
            <div
              className="tab-pane fade active show"
              aria-labelledby="availableVoucher-tab"
            >
              <div className="order-titles d-lg-flex d-none">
                {tableAttributes.map((item) => (
                  <div className={item.className} key={item.value}>
                    <span className="text-capitalize">{item.name}</span>
                  </div>
                ))}
                <div style={{ width: "65px" }}></div>
              </div>
              {meetings?.length > 0 &&
                meetings.map((item, index) => (
                  <CouponItem item={item} key={index} />
                ))}
            </div>
          </div>
        </div>
      </div>
      <MeetingModal isOpen={modalOpen} onRequestClose={closeModal} />
    </div>
  );
};

const CouponItem = React.memo(({ item }) => {
  const { removeMeetings } = useUser();
  return (
    <div className="order-info">
      <div className="task-title">
        <span className="d-lg-none">Agenda: </span>
        <span>{item.meeting_title}</span>
      </div>
      <div className="task-description">
        <span className="d-lg-none">Description: </span>
        <span>{item.meeting_description}</span>
      </div>
      <div className="task-time">
        <span className="d-lg-none">Time: </span>
        <span>{item.time}</span>
      </div>
      <div className="task-status">
        <span className="d-lg-none">Reminder: </span>
        <span>{item.reminder}</span>
      </div>
      <div className="task-delete">
        <button
          onClick={() => removeMeetings(item)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
});
