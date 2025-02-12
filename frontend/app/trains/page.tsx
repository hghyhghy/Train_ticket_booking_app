"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

interface TrainClass {
  id: number;
  type: string;
  price: number;
}

interface Train {
  id: number;
  name: string;
  trainNumber: string;
  source: string;
  destination: string;
  departure: string;
  arrival: string;
  trainClasses?: TrainClass[];
}

export default function Trains() {
  const [trains, setTrains] = useState<Train[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter(); // Initialize Next.js router

  useEffect(() => {
    const fetchTrains = async () => {
      try {
        const response = await fetch("http://localhost:3001/trains");

        if (!response.ok) {
          throw new Error("Failed to fetch trains");
        }

        const data = await response.json();

        if (Array.isArray(data)) {
          setTrains(data);
        } else {
          throw new Error("Invalid data format");
        }
      } catch (err) {
        console.error("Error fetching trains:", err);
        setError("Failed to load trains. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchTrains();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500">Loading trains...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500">{error}</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <h1 className="text-3xl font-normal text-gray-800 mb-6">PREMIUM TRAINS</h1>

      {trains.length === 0 ? (
        <p className="text-gray-600">No trains available.</p>
      ) : (
        <div className="w-[90rem] space-y-6">
          {trains.map((train) => (
            <div
              key={train.id}
              className="bg-white p-6 rounded shadow-md hover:shadow-lg transition-all border border-gray-200"
            >
              <div className="flex flex-row gap-3">
                <h2 className="text-2xl font-normal text-black uppercase">{train.name}</h2>
                <p className="text-gray-600 text-lg">
                  <span className="font-bold">({train.trainNumber})</span>
                </p>
              </div>

              {/* Departure and Arrival Times */}
              <div className="flex flex-row items-center justify-between gap-10 mt-3 w-full">
                {/* Departure */}
                <div className="flex flex-col items-start gap-1">
                  <p className="text-gray-700 text-lg flex items-center gap-2">
                    <span className="text-gray-700 text-lg">
                      <strong>{new Date(train.departure).toLocaleString()}</strong>
                    </span>
                    <span className="font-medium text-blue-950 uppercase">| {train.source}</span>
                  </p>
                </div>

                {/* Arrival */}
                <div className="flex flex-col items-start gap-1">
                  <p className="text-gray-700 text-lg flex items-center gap-2">
                    <span className="text-gray-700 text-lg">
                      <strong>{new Date(train.arrival).toLocaleString()}</strong>
                    </span>
                    <span className="font-medium text-blue-950 uppercase">| {train.destination}</span>
                  </p>
                </div>
              </div>

              {/* Available Train Classes */}
              {train.trainClasses && train.trainClasses.length > 0 && (
                <div className="mt-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">Available Classes:</h3>
                  <ul className="flex gap-4 overflow-x-auto whitespace-nowrap">
                    {train.trainClasses &&
                      train.trainClasses
                        .filter((value, index, self) => self.findIndex(t => t.type === value.type) === index)
                        .map((trainClass) => (
                          <li
                            key={trainClass.id}
                            className="flex flex-col items-center justify-center p-4 w-44 h-24 bg-gray-100 rounded-lg shadow-md"
                          >
                            <span className="font-medium text-gray-800 text-lg">{trainClass.type}</span>
                            <span className="text-green-600 font-bold text-md">₹{trainClass.price}</span>
                          </li>
                        ))}
                  </ul>
                </div>
              )}

              {/* Book Train Button */}

            </div>
          ))}
        </div>
      )}
              <button
                className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
                onClick={() => router.push("/bookings")}
              >
                Book Train
              </button>
    </div>
    
  );
}
