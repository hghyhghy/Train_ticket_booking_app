"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";

export default function BookTicket() {
  const searchParams = useSearchParams();
  const trainId = searchParams.get("trainId");
  const [passengers, setPassengers] = useState([{ name: "", gender: "", age: "", email: "", phone: "" }]);

  const addPassenger = () => {
    setPassengers([...passengers, { name: "", gender: "", age: "", email: "", phone: "" }]);
  };

  const deletepassenger = () => {

    setPassengers([])
  }

  const handleInputChange = (index: number, field: keyof typeof passengers[0], value: string) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const handleSubmit = async () => {
    const res = await fetch("http://localhost:3001/bookings/book", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: 1,  // Hardcoded for testing; replace with actual userId
        trainId,
        classId: 2, // Hardcoded for testing; replace with selected classId
        passengers,
        totalFare: passengers.length * 600, // Example fare calculation
      }),
    });
  
    if (res.ok) {
      alert("Booking successful!");
    } else {
      alert("Booking failed.");
    }
  }

  return (
    <div className="min-h-screen flex flex-col  items-center p-6">
      <h1 className="text-3xl font-bold mb-6">🎫 Book Your Ticket</h1>

      {passengers.map((passenger, index) => (
        <div key={index} className=" p-4 rounded mb-3  flex flex-row gap-5 text-black">
          <input
            type="text"
            placeholder="Name"
            value={passenger.name}
            onChange={(e) => handleInputChange(index, "name", e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <select
            value={passenger.gender}
            onChange={(e) => handleInputChange(index, "gender", e.target.value)}
            className="border p-2 rounded w-full mb-2"
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
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="email"
            placeholder="Email"
            value={passenger.email}
            onChange={(e) => handleInputChange(index, "email", e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
          <input
            type="tel"
            placeholder="Phone"
            value={passenger.phone}
            onChange={(e) => handleInputChange(index, "phone", e.target.value)}
            className="border p-2 rounded w-full mb-2"
          />
        </div>
      ))}

      <button onClick={addPassenger} className="bg-white  text-blue-950 px-4 py-2 rounded">
       +Add Passenger
      </button>

      <button onClick={deletepassenger} className="bg-white  text-blue-950 px-4 py-2 rounded">
         Delete Passenger
      </button>

      <button onClick={handleSubmit} className="bg-green-600 text-white px-4 py-2 rounded mt-4">
        Confirm Booking
      </button>
    </div>
  );
}
