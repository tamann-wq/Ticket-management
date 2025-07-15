import React, { useEffect, useState } from 'react';
import { positionsElement } from '../Constants/constant';
import { motion } from "motion/react";

const TicketManagement = () => {
  const [ticketData, setTicketData] = useState([]);
  const [formData, setFormData] = useState({
    customerName: '',
    title: '',
    positions: 'Assigned',
  });

  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("ticketData")) || [];
    setTicketData(savedData);
  }, []);

  useEffect(() => {
    localStorage.setItem("ticketData", JSON.stringify(ticketData));
  }, [ticketData]);

  const HandleInput = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const HandleFormData = (event) => {
    event.preventDefault();
    const newTicket = {
      id: Date.now(),
      ...formData
    };
    setTicketData([...ticketData, newTicket]);
    setFormData({ customerName: '', title: '', positions: 'Assigned' });
  };

  const onDragStart = (event, id) => {
    event.dataTransfer.setData("ticketId", id);
  };

  const onDrop = (event, newPosition) => {
    const id = parseInt(event.dataTransfer.getData("ticketId"));
    const updatedTickets = ticketData.map((ticket) =>
      ticket.id === id ? { ...ticket, positions: newPosition } : ticket
    );
    setTicketData(updatedTickets);
  };

  const allowDrop = (event) => event.preventDefault();

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-sky-900 text-center mb-6">Ticket Management Board</h1>
      <div className='w-[70%] mx-auto'>
        <form
          onSubmit={HandleFormData}
          className='flex flex-wrap gap-4 bg-white p-6 rounded shadow justify-center mb-8'
        >
          <input
            type="text"
            value={formData.customerName}
            placeholder='Customer Name'
            onChange={HandleInput}
            name='customerName'
            className="border p-2 rounded w-48"
            required
          />
          <input
            type="text"
            value={formData.title}
            placeholder='Ticket Title'
            onChange={HandleInput}
            name='title'
            className="border p-2 rounded w-48"
            required
          />
          <select
            className="border p-2 rounded w-48"
            name='positions'
            value={formData.positions}
            onChange={HandleInput}
          >
            {positionsElement.map((items) => (
              <option key={items} value={items}>{items}</option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 cursor-pointer"
          >
            Create Your Ticket
          </button>
        </form>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-4">
        {positionsElement.map((positionElement) => (
          <div
            key={positionElement}
            onDrop={(event) => {
              if (positionElement !== 'Closed') onDrop(event, positionElement);
            }}
            onDragOver={(event) => {
              if (positionElement !== 'Closed') allowDrop(event);
            }}
            className={`bg-white p-4 rounded shadow min-h-[200px] ${
              positionElement === 'Closed' ? 'bg-gray-200' : ''
            }`}
          >
            <h2 className="text-xl text-orange-600 font-semibold mb-2">{positionElement}</h2>
            {ticketData
              .filter((ticketElement) => ticketElement.positions === positionElement)
              .map((ticket) => (
                <div
                  key={ticket.id}
                  draggable={positionElement !== 'Closed'}
                  onDragStart={(event) => onDragStart(event, ticket.id)}
                  className={`p-3 mb-2 border rounded-md shadow-sm ${
                    positionElement === 'Closed' ? 'bg-gray-400 cursor-not-allowed' : 'bg-gray-100 cursor-grab'
                  }`}
                >
                  <p className="font-bold">{ticket.title}</p>
                  <p className="text-sm text-gray-600">{ticket.customerName}</p>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TicketManagement;
