import React, { useState, useEffect, useCallback } from "react";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../hooks/useUser.jsx";
import { useTypewriterEffect } from "../../hooks/useTypewriterEffect.jsx";
import { MyToast } from "../../components/MyToast.jsx";

const tableAttributes = [
  { name: "Task", value: "task", className: "task-title" },
  { name: "Description", value: "description", className: "task-description" },
  { name: "Time", value: "time", className: "task-time" },
  { name: "Status", value: "status", className: "task-status" },
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

Modal.setAppElement("#root"); // Set the root element for accessibility

const TaskModal = React.memo(({ isOpen, onRequestClose }) => {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDescription, setTaskDescription] = useState("");
  const [time, setTime] = useState("");

  const { addTasks, tasks } = useUser();

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const now = new Date();
      const inputTime = new Date();
      const [hours, minutes] = time.split(":");
      inputTime.setHours(hours, minutes);

      if (!taskTitle || !taskDescription || !time) {
        MyToast("Please fill all field", "error")
        return
      }

      if (inputTime < now) {
        console.error("Error task time cannot be in past");
        MyToast("The task cannot be in the past", "error");
        return;
      }
      const currentId = tasks?.[tasks?.length - 1]?.id + 1 || 1;
      addTasks({
        task_title: taskTitle,
        task_description: taskDescription,
        time,
        status: "Pending",
        id: currentId,
      });
      setTaskTitle("");
      setTaskDescription("");
      setTime("");
      onRequestClose();
    },
    [addTasks, tasks, taskTitle, taskDescription, time, onRequestClose]
  );

  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose} style={customStyles}>
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label>
          <input
            type="text"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
            className="input-modal-text"
          />
        </div>
        <div>
          <label>Description</label>
          <textarea
            value={taskDescription}
            onChange={(e) => setTaskDescription(e.target.value)}
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
        <button type="submit" className="button-modal button-submit" disabled={!taskTitle || !taskDescription || !time}>
          Save
        </button>
        <button
          type="button"
          className="button-modal button-cancel"
          onClick={onRequestClose}
        >
          Cancel
        </button>
      </form>
    </Modal>
  );
});

export const Tasks = () => {
  const { name, loggedIn, tasks } = useUser();
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const typingEffect = useTypewriterEffect(
    "Talk to AI and break your goals in to achievable tasks"
  );

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn]);

  const openModal = useCallback(() => setModalOpen(true), []);
  const closeModal = useCallback(() => setModalOpen(false), []);

  return (
    <div>
      <div>
        <h1 className="text-3xl font-bold mb-6">{name + "'"}s Tasks</h1>
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
            Add Task
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
              {tasks?.length > 0 &&
                tasks.map((item, index) => (
                  <CouponItem item={item} key={index} />
                ))}
            </div>
          </div>
        </div>
      </div>
      <TaskModal isOpen={modalOpen} onRequestClose={closeModal} />
    </div>
  );
};

const CouponItem = React.memo(({ item }) => {
  const { removeTasks } = useUser();
  return (
    <div className="order-info">
      <div className="task-title">
        <span className="d-lg-none">Task: </span>
        <span>{item.task_title}</span>
      </div>
      <div className="task-description">
        <span className="d-lg-none">Description: </span>
        <span>{item.task_description}</span>
      </div>
      <div className="task-time">
        <span className="d-lg-none">Time: </span>
        <span>{item.time}</span>
      </div>
      <div className="task-status">
        <span className="d-lg-none">Status: </span>
        <span>{item.status}</span>
      </div>
      <div className="task-delete">
        <button
          onClick={() => removeTasks(item)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Delete
        </button>
      </div>
    </div>
  );
});
