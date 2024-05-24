import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Occurrence = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.occurrence.date}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.occurrence.description}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.occurrence.name}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      {props.occurrence.fixed}
    </td>
    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${props.occurrence._id}`}
        >
          Edit
        </Link>
        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          color="red"
          type="button"
          onClick={() => {
            props.deleteOccurrence(props.occurrence._id);
          }}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function OccurrenceList() {
  const [occurrences, setOccurrences] = useState([]);

  // This method fetches the occurrences from the database.
  useEffect(() => {
    async function getOccurrences() {
      const response = await fetch(`http://localhost:5050/occurrence/`);
      if (!response.ok) {
        const message = `An error occurred: ${response.statusText}`;
        console.error(message);
        return;
      }
      const occurrences = await response.json();
      setOccurrences(occurrences);
    }
    getOccurrences();
    return;
  }, [occurrences.length]);

  // The delete method
  async function deleteOccurrence(id) {
    await fetch(`http://localhost:5050/occurrence/${id}`, {
      method: "DELETE",
    });
    const newOccurrences = occurrences.filter((el) => el._id !== id);
    setOccurrences(newOccurrences);
  }

  // This method will map out the occurrences on the table
  function occurrenceList() {
    return occurrences.map((occurrence) => {
      return (
        <Occurrence
          occurrence={occurrence}
          deleteOccurrence={() => deleteOccurrence(occurrence._id)}
          key={occurrence._id}
        />
      );
    });
  }

  // This following section will display the table with the occurrences.
  return (
    <>
      <h3 className="text-lg font-semibold p-4">Occurrence Records</h3>
      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&amp;_tr]:border-b">
              <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Date
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Description
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Reported By
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Fixed?
                </th>
                <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="[&amp;_tr:last-child]:border-0">
              {occurrenceList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
