/* eslint-disable react/prop-types */

import { createContext, useRef, useState, useEffect } from "react";
import { UserService } from "../services/user";
import { MyToast } from "../components/MyToast";

export const UserContext = createContext({
  name: "Guest",
  loggedIn: false,
  tasks: [],
  meetings: [],
});

export const UserProvier = ({ children }) => {
  const userService = useRef(new UserService());
  const [loggedIn, setLoggedIn] = useState(false);
  const [name, setName] = useState("Guest");
  const [tasks, setTasks] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [taskTimers, setTaskTimers] = useState([]);
  const [meetingTimers, setMeetingTimers] = useState([]);

  const logout = () => {
    userService.current.logout();
    setLoggedIn(false);
    setName("");
    setTasks([]);
    setMeetings([]);
    clearAllTimers()
  };

  const login = (username, password) => {
    // userService.login(username, password);
    setLoggedIn(true);
    setName(username);
  };

  const clearTaskTimers = (task) => {
    taskTimers.forEach((timer) => {
      if(timer.id === task.id) {
        console.log(timer)
        clearTimeout(timer.timer)
      }
    });
  };

  const clearMeetingTimers = (meeting) => {
    meetingTimers.forEach((timer) => {
      if(timer.id === meeting.id) {
        console.log(timer)
        clearTimeout(timer.timer)
      }
    });
  };

  const clearAllTimers = () => {
    taskTimers.forEach((timer) => clearTimeout(timer))
    meetingTimers.forEach((timer) => clearTimeout(timer))
  }

  const scheduleTaskTimer = (task) => {
    const now = new Date();
    const taskTime = new Date();
    const [hours, minutes] = task.time.split(":");
    taskTime.setHours(hours, minutes);
    const delay = taskTime - now;

    const timer = setTimeout(() => {
      // Function to be executed when the timer triggers
      console.log(`Task ${task.task_title} is due!`);
      MyToast(`Task ${task.task_title} is due!`)
      removeTasks(task)
    }, delay);

    setTaskTimers((oldTimers) => oldTimers.concat({timer, id : task.id}));
  };

  const scheduleMeetingTimer = (meeting) => {
    const now = new Date();
    const meetingTime = new Date();
    const [hours, minutes] = meeting.time.split(":");
    meetingTime.setHours(hours, minutes);
    const delay = meetingTime - now;

    const timer = setTimeout(() => {
      // Function to be executed when the timer triggers
      console.log(`Meeting ${meeting.meeting_title} is due!`);
      MyToast(`Meeting ${meeting.meeting_title} is due!`)
      removeMeetings(meeting)
    }, delay);

    setMeetingTimers((oldTimers) => oldTimers.concat({timer, id:meeting.id}));
  };

  const addTasks = (newTask) => {
    const now = new Date();
    const inputTime = new Date();
    const [hours, minutes] = newTask.time.split(":");
    inputTime.setHours(hours, minutes);

    if (inputTime < now) {
      console.error("Error task time cannot be in past");
      MyToast("The task cannot be in the past", "error")
      return;
    }

    setTasks((oldTasks) => {
      const updatedTasks = oldTasks.concat(newTask);
      scheduleTaskTimer(newTask);
      return updatedTasks;
    });
  };

  const removeTasks = (removeTask) => {
    setTasks((oldTasks) => {
      const updatedTasks = oldTasks.filter((item) => item.id !== removeTask.id);
      clearTaskTimers(removeTask);
      return updatedTasks;
    });
  };

  const addMeetings = (newMeeting) => {
    const now = new Date();
    const inputTime = new Date();
    const [hours, minutes] = newMeeting.time.split(":");
    inputTime.setHours(hours, minutes);

    if (inputTime < now) {
      console.error("Error task time cannot be in past");
      MyToast("The task cannot be in the past", "error")
      return;
    }
    setMeetings((oldMeetings) => {
      const updatedMeetings = oldMeetings.concat(newMeeting);
      scheduleMeetingTimer(newMeeting);
      return updatedMeetings;
    });
  };

  const removeMeetings = (removeMeeting) => {
    setMeetings((oldMeetings) => {
      const updatedMeetings = oldMeetings.filter((item) => item.id !== removeMeeting.id);
      clearMeetingTimers(removeMeeting);
      return updatedMeetings;
    });
  };

  return (
    <UserContext.Provider
      value={{
        name,
        loggedIn,
        logout,
        login,
        tasks,
        meetings,
        addMeetings,
        addTasks,
        removeMeetings,
        removeTasks,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
