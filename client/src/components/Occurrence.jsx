import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const Occurrence = () => {
  // State for form data
  const [occurrenceData, setOccurrenceData] = useState({
    date: "",
    description: "",
    fixed: "",
  });
  // State to determine if the record is new
  const [isNewRecord, setIsNewRecord] = useState(true);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch occurrence data if an ID is present
    const getOccurrence = async () => {
      if (!id) return;

      setIsNewRecord(false);
      try {
        const response = await fetch(`http://localhost:5050/occurrence/${id}`);
        if (!response.ok) {
          console.error(`Error: ${response.statusText}`);
          return;
        }
        const data = await response.json();
        if (!data) {
          console.warn(`No record found with ID: ${id}`);
          navigate("/");
          return;
        }
        setOccurrenceData(data);
      } catch (error) {
        console.error("Fetch error: ", error);
      }
    };
    getOccurrence();
  }, [id, navigate]);

  // Update form state
  const handleFormUpdate = (value) => {
    setOccurrenceData((prevData) => ({ ...prevData, ...value }));
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const method = isNewRecord ? "POST" : "PATCH";
      const endpoint = isNewRecord
        ? "http://localhost:5050/occurrence"
        : `http://localhost:5050/occurrence/${id}`;
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(occurrenceData),
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      setOccurrenceData({ date: "", description: "", fixed: "" });
      navigate("/");
    } catch (error) {
      console.error("Submission error: ", error);
    }
  };

  return (
    <>
      <h3 className="text-lg font-semibold p-4">
        Create/Update Occurrence Record
      </h3>
      <form
        onSubmit={handleSubmit}
        className="border rounded-lg overflow-hidden p-4"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-slate-900/10 pb-12 md:grid-cols-2">
          <div>
            <h2 className="text-base font-semibold leading-7 text-slate-900">
              Occurrence Details
            </h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">
              Record the occurrence information here
            </p>
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 ">
            <div className="sm:col-span-4">
              <label
                htmlFor="date"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Date
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="date"
                    name="date"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    value={occurrenceData.date}
                    onChange={(e) => handleFormUpdate({ date: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <div className="sm:col-span-4">
              <label
                htmlFor="description"
                className="block text-sm font-medium leading-6 text-slate-900"
              >
                Description
              </label>
              <div className="mt-2">
                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-slate-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                  <input
                    type="text"
                    name="description"
                    id="description"
                    className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-slate-900 placeholder:text-slate-400 focus:ring-0 sm:text-sm sm:leading-6"
                    placeholder="Describe the occurrence here"
                    value={occurrenceData.description}
                    onChange={(e) =>
                      handleFormUpdate({ description: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div>
              <fieldset className="mt-4">
                <legend className="sr-only">Fixed? Options</legend>
                <div className="space-y-4 sm:flex sm:items-center sm:space-x-10 sm:space-y-0">
                  <div className="flex items-center">
                    <input
                      id="fixedYes"
                      name="fixedOptions"
                      type="radio"
                      value="Yes"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={occurrenceData.fixed === "Yes"}
                      onChange={(e) =>
                        handleFormUpdate({ fixed: e.target.value })
                      }
                    />
                    <label
                      htmlFor="fixedYes"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      Yes
                    </label>
                    <input
                      id="fixedNo"
                      name="fixedOptions"
                      type="radio"
                      value="No"
                      className="h-4 w-4 border-slate-300 text-slate-600 focus:ring-slate-600 cursor-pointer"
                      checked={occurrenceData.fixed === "No"}
                      onChange={(e) =>
                        handleFormUpdate({ fixed: e.target.value })
                      }
                    />
                    <label
                      htmlFor="fixedNo"
                      className="ml-3 block text-sm font-medium leading-6 text-slate-900 mr-4"
                    >
                      No
                    </label>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </div>
        <input
          type="submit"
          value="Save Occurrence Record"
          className="inline-flex items-center justify-center whitespace-nowrap text-md font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3 cursor-pointer mt-4"
        />
      </form>
    </>
  );
};

export default Occurrence;
