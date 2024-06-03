import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { useUser } from "../../hooks/useUser.jsx";
import { Autocomplete, Paper, TextField } from "@mui/material";
import loader from "../../assets/images/loader.gif";
import { MyToast } from "../../components/MyToast.jsx";
import { useTypewriterEffect } from "../../hooks/useTypewriterEffect.jsx";

const roles = ["Job", "Student", "Freelancer"];

export const UserProfile = () => {
  function CustomPaper(props) {
    return <Paper {...props} style={{ maxHeight: 400, overflow: "auto" }} />;
  }

  const hoverAndActiveStyles = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
        borderWidth: "1px", // Set the border width to 1px
        backgroundColor: "transparent !important",
        borderColor: "#219ebc !important",
      },
      "&:hover .MuiOutlinedInput-notchedOutline": {
        borderColor: "#dbdbdb", // Maintain the same border color on hover
      },
      "& .MuiOutlinedInput-notchedOutline": {
        "&:hover": {
          borderColor: "#dbdbdb",
        },
      },
    },
  };
  const { name, loggedIn, tasks } = useUser();
  const navigate = useNavigate();

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm();

  const currentRole = watch("role");
  const currentTitle = watch("name");
  const currentTime = watch("startTime");

  const [isLoading, setIsLoading] = useState(false);
  const [recommmendations, setRecommmendations] = useState([]);

  const typingEffect = useTypewriterEffect(
    "Help AI recommendations, add improvememt notes, talk to AI"
  );

  useEffect(() => {
    if (!loggedIn) {
      navigate("/login");
    }
  }, [loggedIn]);

  const onSubmit = (data) => {
    const now = new Date();
    const inputTime = new Date();
    const [hours, minutes] = data.startTime.split(":");
    inputTime.setHours(hours, minutes);

    if (inputTime < now) {
      MyToast("Error task time cannot be in past", "error");
      return;
    }
    setIsLoading(true);
    const currentId = tasks?.[tasks?.length - 1]?.id + 1 || 1;
    setRecommmendations([
      {
        task_title: currentRole,
        task_description: currentTitle,
        time: currentTime,
        status: "Pending",
        id: currentId,
      },
    ]);
    setValue("role", "");
    setValue("name", "");
    setTimeout(() => {
      setIsLoading(false);
    }, 500);
  };

  const resetRecommendations = () => {
    setRecommmendations([]);
  };

  console.log(recommmendations);

  return (
    <div>
      <h1>{name + "'"}s profile and personalization</h1>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          {/* <div className="col-xl-3 col-md-6">
          <div className="mb-4 d-flex flex-column">
            <label>
              City: <span className="passtextColor">*</span>
            </label>

            <Controller
              name="role"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <select id="selectField" {...field}>
                  <option value="job">Job</option>
                  <option value="student">Student</option>
                  <option value="freelancer">Freelancer</option>
                </select>
              )}
            />
          </div>
        </div> */}

          <div className="col-xl-3 col-md-6">
            <div className="mb-4 d-flex flex-column">
              <label>
                Role:<span className="passtextColor">*</span>
              </label>
              <Controller
                name="role"
                control={control}
                rules={{ required: true }}
                defaultValue=""
                render={({ field }) => (
                  <>
                    <Autocomplete
                      PaperComponent={CustomPaper}
                      onChange={(e, option) => {
                        field.onChange(option);
                        setValue("name", "");
                      }}
                      value={currentRole || "Select Role"}
                      id="city-select"
                      options={roles}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          sx={{ ...hoverAndActiveStyles }}
                        />
                      )}
                    />
                    {errors.role && (
                      <p className="error" style={{ color: "red" }}>
                        State is required
                      </p>
                    )}
                  </>
                )}
              />
            </div>
          </div>
          {currentRole?.length > 0 && (
            <div className="col-xl-3 col-md-6">
              <div className="mb-4 d-flex flex-column">
                <label>
                  Title:
                  <span className="passtextColor">*</span>
                </label>
                <input
                  placeholder={
                    currentRole === "Job"
                      ? "Enter Job Title"
                      : currentRole === "Student"
                      ? "Enter Current Program"
                      : "Enter Field Name"
                  }
                  {...register("name", {
                    required: true,
                  })}
                  className="form-control mt-2"
                />
                {errors.name?.type === "required" && (
                  <p role="alert" style={{ color: "red" }}>
                    Required
                  </p>
                )}
              </div>
            </div>
          )}

          {currentTitle?.length > 0 && (
            <div className="col-xl-3 col-md-6">
              <div className="mb-4 d-flex flex-column">
                <label>
                  Starting Time:
                  <span className="passtextColor">*</span>
                </label>
                <input
                  type="time"
                  {...register("startTime", {
                    required: true,
                  })}
                  className="form-control mt-2"
                />
                {errors.startTime?.type === "required" && (
                  <p role="alert" style={{ color: "red" }}>
                    Required
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="col-md-12">
            <div className="mb-3 mt-3">
              <button className="btn-theme" style={{ width: "200px" }}>
                <>Save Profile</>
              </button>
            </div>
          </div>
        </div>
      </form>
      {isLoading ? (
        <img
          src={loader}
          alt="Loading Related Products"
          style={{ width: "100px" }}
        />
      ) : (
        recommmendations?.length > 0 && (
          <>
            <h1>Recommendations</h1>
            <CouponItem
              item={recommmendations[0]}
              onClick={resetRecommendations}
            />
          </>
        )
      )}
      {/* <input type="text" placeholder="Help AI recommendations, add improvememt notes, talk to AI"/> */}
      <input
        type="text"
        placeholder={typingEffect}
        className="mr-2 px-2 py-1 border rounded col-9 col-xs-6"
      />
    </div>
  );
};

const CouponItem = React.memo(({ item, onClick }) => {
  const { addTasks } = useUser();
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
          onClick={() => {
            addTasks(item);
            onClick();
          }}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
        >
          Add Task
        </button>
      </div>
    </div>
  );
});
