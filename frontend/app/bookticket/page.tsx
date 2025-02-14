"use client";

import { useState,useEffect } from "react";
import { useSearchParams,useRouter } from "next/navigation";

interface TrainClass {
  id: number;
  type: string;
  price: number;
}

export default function BookTicket() {
  const searchParams = useSearchParams();
  const trainId = searchParams.get("trainId");
  const [train, setTrain] = useState<{ name: string; source: string; destination: string; trainNumber:string; departure:string,arrival:string;trainClasses:TrainClass[] } | null>(null)
  const [passengers, setPassengers] = useState([{ name: "", gender: "", age: "", coachPosition: "", coachType: "" }]);
  const [error, setError] = useState("");
  const router= useRouter()

  useEffect(() => {
    
    if (trainId){

      fetch(`http://localhost:3001/trains/${trainId}`)
      .then((res) => res.json())
      .then((data) => setTrain(data))
      .catch(() => setError("Failed to fetch train details."));
    }
  

  }, [trainId])
  

  const addPassenger = () => {
    setPassengers([...passengers, { name: "", gender: "", age: "", coachPosition: "", coachType: "" }]);
    setError(""); // Clear error when adding a new passenger
  };

  const deletePassenger = () => {
    if (passengers.length > 1) {
      setPassengers(passengers.slice(0, -1)); // Remove last passenger
    } else {
      setError("At least one passenger is required."); // Show error if only one remains
    }
  };

  const handleInputChange = (index: number, field: keyof typeof passengers[0], value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const handleSubmit = async () => {
    const totalFare = passengers.length * 600; 
    try {
      const res = await fetch("http://localhost:3001/bookings/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: 1, // Replace with actual userId
          trainId,
          classId: 2, // Replace with selected classId
          passengers,
          totalFare, // Example fare calculation
        }),
      });
  
      const data = await res.json();
      console.log("Booking Response:", data); // ✅ Debugging response
  
      // ✅ Extract bookingId from the first passenger
      const bookingId = data.passengers?.[0]?.bookingId; 
  
      if (res.ok && bookingId) {
        console.log("Redirecting to ticket:", `/ticket/${bookingId}`); // ✅ Debugging
        router.push(`/ticket/${bookingId}`); // ✅ Fixed redirection
      } else {
        setError("Booking failed. Invalid booking response.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("Booking failed due to an error.");
    }
  };
  
  
  

  return (
    <div className="min-h-screen flex flex-col items-center p-6  bg-[#F3F4F6] w-full">
      <h1 className="text-3xl font-bold mb-6  text-black">CONFIRM YOUR TICKET</h1>

      {train ? (
        <div className="w-full max-w-3xl bg-white p-4 rounded shadow-md mb-6 text-black uppercase h-56">
          <h2 className=" font-semibold font-sans text-2xl text-blue-950 flex items-center justify-center ">Booking For</h2>
          <div className=" flex flex-row uppercase mt-12">
          <p className=" font-normal text-2xl"><strong></strong> {train.name}</p>
          <p className=" text-2xl "><strong>   </strong> ({train.trainNumber}) </p>
          </div>
            {/* Departure & Arrival */}
            <div className="flex flex-row items-center justify-between gap-10 mt-3 w-full">
              {/* Departure */}
              <div className="flex flex-col items-start gap-1">
                <p className="text-gray-700 text-lg flex items-center gap-2">
                  <span className="text-gray-700 text-1xl">
                    <strong>{new Date(train.departure).toLocaleString()}</strong>
                  </span>
                  <span className="font-medium text-blue-950 uppercase">| {train.source}</span>
                </p>
              </div>

              {/* Arrival */}
              <div className="flex flex-col items-start gap-1">
                <p className="text-gray-700 text-lg flex items-center gap-2">
                  <span className="text-gray-700 text-1xl">
                    <strong>{new Date(train.arrival).toLocaleString()}</strong>
                  </span>
                  <span className="font-medium text-blue-950 uppercase">| {train.destination}</span>
                </p>
              </div>
            </div>

          {train.trainClasses && train.trainClasses.length > 0 && (
              <div className="mt-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">Available Classes:</h3>
                <ul className="flex gap-4 overflow-x-auto whitespace-nowrap">
                  {train.trainClasses
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

        </div>
      ) : (
        <p className="text-gray-600 mb-4">Loading train details...</p>
      )}


      {passengers.map((passenger, index) => (
        <div key={index} className="p-4 rounded mb-3 flex flex-row gap-5 text-black items-center">
          <input
            type="text"
            placeholder="Name"
            value={passenger.name}
            onChange={(e) => handleInputChange(index, "name", e.target.value)}
            className="border p-2 rounded w-full"
          />
          <select
            value={passenger.gender}
            onChange={(e) => handleInputChange(index, "gender", e.target.value)}
            className="border p-2 rounded w-full"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="number"
            placeholder="Age"
            value={passenger.age}
            onChange={(e) => handleInputChange(index, "age", e.target.value)}
            className="border p-2 rounded w-full"
          />
            <select
              value={passenger.coachType}
              onChange={(e) => handleInputChange(index, "coachType", e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select Coach Type</option>
              <option value="Sleeper">Sleeper</option>
              <option value="AC">AC</option>
              <option value="General">Chair Car</option>
            </select>
            <select
                value={passenger.coachPosition}
                onChange={(e) => handleInputChange(index, "coachPosition", e.target.value)}
                className="border p-2 rounded"
              >
                <option value="">Select Coach Position</option>
                <option value="AC 3 Tier">AC 3 Tier</option>
                <option value="AC 2 Tier">AC 2 Tier</option>
                <option value="AC First">AC First</option>
                <option value="S7">S1-S7</option>
              </select>
                <div className="flex flex-row gap-5 items-center w-full">
        <button onClick={addPassenger} className="bg-white text-blue-950 px-6 py-2 rounded w-44">
          + Add Passenger
        </button>
      </div>
        </div>
      ))}

      {/* ✅ Fix: Add button in same row, inside a flex container */}


      {error && <p className="text-red-600 font-semibold mt-2">{error}</p>}

      <button onClick={deletePassenger} className="bg-white text-blue-950 px-4 py-2 rounded mt-2">
        Delete Passenger
      </button>

      <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded mt-4">
        Confirm Booking
      </button>
    </div>
  );
}