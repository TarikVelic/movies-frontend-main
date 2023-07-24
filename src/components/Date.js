import React, { useState } from "react";

const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useState("");
  const days = ["Četvrak", "Petak", "Subota", "Nedelja", "Ponedeljak", "Utorak", "Srijeda"];

  const formatDate = (date) => {
    if (!date) {
      return "Izaberite datum";
    }
    const options = { day: "numeric", month: "numeric", weekday: "long" };
    const formatter = new Intl.DateTimeFormat("bs", options);
    const [weekday, day, month] = formatter.formatToParts(date).map((part) => part.value);
    return `${day} ${month}, ${weekday}`;
  };

  const handleDateSelect = (event) => {
    setSelectedDate(event.target.value);
  };

  const renderOptions = () => {
    const dateArray = [];
    for (let i = 0; i < 6; i++) {
      const date = new Date(Date.now() + 86400000 * i);
      const formatter = new Intl.DateTimeFormat("bs", { weekday: "long" });
      const day = days[i] || formatter.format(date);
      dateArray.push(
        <option key={date.toISOString()} value={date.toISOString().substring(0, 10)}>
          {formatDate(date)}, {day}
        </option>
      );
    }
    return dateArray;
  };

  return (
    <div className='form-group'>
      <label htmlFor='dateSelect'>Datum:</label>
      <select className='form-control' id='dateSelect' onChange={handleDateSelect} value={selectedDate}>
        {renderOptions()}
      </select>
    </div>
  );
};

export default DatePicker;
