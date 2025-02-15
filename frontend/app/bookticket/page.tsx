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
  const [passengers, setPassengers] = useState([{ name: "", gender: "", age: "", coachPosition: "", coachType: "",Nationality:"",Food:"" }]);
  const [error, setError] = useState("");
  const router= useRouter()
  const [distance, setdistance] = useState<number|null>(null)
  const [autoUpgrade, setAutoUpgrade] = useState(true);
  const [confirmBerth, setConfirmBerth] = useState(false);
  const [insurance, setInsurance] = useState("no");
  const [phonenumber, setphonenumber] = useState("")
  const [formvalid, setformvalid] = useState(false)



  const generatedistance=()=>{
    return Math.floor(500 + Math.random()*501)

  }

  useEffect(() => {
    
    if (trainId){

      fetch(`http://localhost:3001/trains/${trainId}`)
      .then((res) => res.json())
      .then((data) => setTrain(data))
      .catch(() => setError("Failed to fetch train details."));
      setdistance(generatedistance())
    }
  

  }, [trainId])


  useEffect(() => {
    const everyPassengerFilled = passengers.every((p) => 
      p.name.trim() !== "" &&
      p.gender !== "" &&
      p.age.trim() !== "" &&
      p.Nationality !== "" &&
      p.coachPosition !== "" &&
      p.coachType !== "" &&
      p.Food !== ""
    );
  
  
    setformvalid(everyPassengerFilled);
    setformvalid(true)
  }, [passengers]); 
  
  const handleSubmit1 = async () => {
    console.log("Form Valid Status:", formvalid); // Debugging log

    if (!formvalid) {
      setError("Please fill in all required fields before proceeding.");
      return;
    }
  
    console.log("Form is valid. Proceeding to payment...");
    setError(""); // Clear any previous error
    
    if (formvalid){

      // Now you can proceed with submission
      handleSubmit();
    }
  }
  const addPassenger = () => {
    setPassengers([...passengers, { name: "", gender: "", age: "", coachPosition: "", coachType: "",Nationality:"",Food:"" }]);
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
        router.push(`/payment/${bookingId}`); // ✅ Fixed redirection
      } else {
        setError("Booking failed. Invalid booking response.");
      }
    } catch (err) {
      console.error("Booking error:", err);
      setError("Booking failed due to an error.");
    }
  };
  
  
  

  return (
    <div className="min-h-screen flex flex-col  p-6  bg-white w-full items-start justify-start">

      {train ? (
        <div className="w-[65rem]  bg-white p-4 rounded shadow-md mb-6 text-black uppercase h-56 border border-blue-900">
          <div className=" flex flex-row uppercase bg-[#F5F5F5]  p-2">
            <div className="-mt-1 ">

          <p className=" font-semibold text-2xl "><strong></strong> {train.name}</p>
            </div>
            <div className="-mt-1">

          <p className=" text-2xl  text-semibold"><strong>   </strong> ({train.trainNumber}) </p>
            </div>
          </div>
            {/* Departure & Arrival */}
            <div className="flex flex-row items-center justify-between gap-10 mt-3 w-full bg-[#fee4e4]  p-5">
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
            <div className="flex flex-col justify-center items-center absolute left-[30rem] top-44 ">
            <h2 className="text-lg font-normal text-gray-800 uppercase">
              Distance
            </h2>
            <span className="text-blue-900">{distance} km</span>
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
      
      <div className=" flex flex-col gap-5 mt-2 mb-4 w-[65rem] border border-blue-950 h-[12rem] p-5">
        <div className=" text-black"> <h1 className="  font-semibold text-2xl">Contact Details</h1> </div>
        <div><p className=" text-black font-semibold">(Ticket details will be sent to email- su******@nsec.ac.in and registered mobile number 62******57)</p></div>
        <div>
 
          <div   className="w-1/2">

          <input
            type="number"
            placeholder="Phonenumber"
            value={phonenumber}
            onChange={(e) => setphonenumber(e.target.value)}
            className="border p-2 rounded w-full border-blue-950 text-black bg-[#F5F5F5]"
            required
          />

          </div>

        </div>
      </div>
      <div className="w-[65rem] p-6 border border-blue-950 rounded bg-white text-black flex flex-col items-start justify-start gap-10 mb-4">
      {/* GST Details */}
      <div className="flex space-x-4 mb-6">
        <button className="w-1/2 py-2 border rounded-lg bg-gray-100">
          GST Details (Optional)
        </button>
        <input
          type="text"
          placeholder="GST Identification Number (GSTIN)"
          className="w-1/2 border px-4 py-2 rounded-lg"
        />
      </div>

      {/* Other Preferences */}
      <div className="border rounded-lg p-4 bg-[#F5F5F5]">
        <h2 className="text-lg font-semibold mb-3">Other Preferences</h2>

        {/* Auto Upgrade */}
        <label className="flex items-center space-x-2 mb-3">
          <input
            type="checkbox"
            checked={autoUpgrade}
            onChange={() => setAutoUpgrade(!autoUpgrade)}
            className="w-5 h-5"
          />
          <span className="font-semibold">Consider for Auto Upgradation.</span>
        </label>

        {/* Confirm Berth */}
        <label className="flex items-center space-x-2 mb-3">
          <input
            type="checkbox"
            checked={confirmBerth}
            onChange={() => setConfirmBerth(!confirmBerth)}
            className="w-5 h-5"
          />
          <span>Book only if confirm berths are allotted.</span>
        </label>

        {/* Booking Preferences */}
        <select className="w-full border px-4 py-2 rounded-lg mb-3">
          <option>Book, only if all berths are allotted in same coach.</option>
          <option>Book in any coach.</option>
        </select>

        {/* Preferred Coach */}
        <input
          type="text"
          placeholder="Preferred Coach No."
          className="w-full border px-4 py-2 rounded-lg"
        />
      </div>

      {/* Travel Insurance */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold">
          Travel Insurance (Incl. of GST)
        </h2>
        <p className="text-sm text-gray-600">
          Do you want to take Travel Insurance (₹0.45/person)?
        </p>

        <div className="mt-3 flex space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="radio"
              name="insurance"
              value="yes"
              checked={insurance === "yes"}
              onChange={() => setInsurance("yes")}
              className="w-5 h-5"
            />
            <span>
              Yes, and I accept the{" "}
              <a href="#" className="text-blue-600">
                terms & conditions
              </a>
            </span>
          </label>

          <label className="flex items-center space-x-2 text-orange-600 font-semibold">
            <input
              type="radio"
              name="insurance"
              value="no"
              checked={insurance === "no"}
              onChange={() => setInsurance("no")}
              className="w-5 h-5"
            />
            <span>No, I don’t want travel insurance</span>
          </label>
        </div>
      </div>
    </div>

      {passengers.map((passenger, index) => (
        <div key={index} className="p-4 rounded mb-3 flex flex-row  gap-2 text-black items-center">
          <input
            type="text"
            placeholder="Name"
            value={passenger.name}
            onChange={(e) => handleInputChange(index, "name", e.target.value)}
            className="border p-2 rounded w-full border-blue-950"
            required
          />
          <select
            value={passenger.gender}
            onChange={(e) => handleInputChange(index, "gender", e.target.value)}
            className="border p-2 rounded w-full border-blue-950"
            required
          >
            <option value="">Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="number"
            placeholder="Age"
            value={passenger.age}
            onChange={(e) => handleInputChange(index, "age", e.target.value)}
            className="border p-2 rounded w-full border-blue-950"
            required
          />
            <select
              value={passenger.coachType}
              onChange={(e) => handleInputChange(index, "coachType", e.target.value)}
              className="border p-2 rounded border-blue-950"
              required
            >
              <option value=""> Coach Type</option>
              <option value="Sleeper">Sleeper</option>
              <option value="AC">AC</option>
              <option value="General">Chair Car</option>
            </select>
            <select
                value={passenger.coachPosition}
                onChange={(e) => handleInputChange(index, "coachPosition", e.target.value)}
                className="border p-2 rounded border-blue-950"
                required
              >
                <option value=""> Coach Position</option>
                <option value="AC 3 Tier">AC 3 Tier</option>
                <option value="AC 2 Tier">AC 2 Tier</option>
                <option value="AC First">AC First</option>
                <option value="S7">S1-S7</option>
              </select>
              <select
                value={passenger.Nationality}
                onChange={(e) => handleInputChange(index, "Nationality", e.target.value)}
                className="border p-2 rounded border-blue-950"
                required
              >
                <option value="">Indian</option>
                <option value="Non Indian">Non Indian</option>
              </select>

              <select
                value={passenger.Food}
                onChange={(e) => handleInputChange(index, "Food", e.target.value)}
                className="border p-2 rounded border-blue-950"
                required
              >
                <option value="">Food</option>
                <option value="Non Veg">Non Veg</option>
                <option value="Veg">Veg</option>
                <option value="No Food">No Food</option>



              </select>

              
                <div className="flex flex-row gap-5 items-center w-full">
        <button onClick={addPassenger} className="bg-white text-blue-950 px-6 py-2 rounded w-44 border border-black">
          + Add Passenger
        </button>
      </div>
        </div>
      ))}






      {/* */}

      {/* ✅ Fix: Add button in same row, inside a flex container */}


      {error && <p className="text-red-600 font-semibold mt-2">{error}</p>}

      <div className=" flex flex-row gap-2">


      <button onClick={deletePassenger} className="bg-white text-blue-950 px-4 py-2 rounded mt-2 border border-black ">
        Delete Passenger
      </button>

  

      <button onClick={handleSubmit1}className={`px-4 py-2 rounded mt-2 border border-black ${formvalid ? "bg-blue-600 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"}`}>
        Confirm Payment
      </button>
      </div>
    </div>
  );
}
