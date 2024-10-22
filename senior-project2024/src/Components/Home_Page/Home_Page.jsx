// Import React and necessary hooks
import React, { useState } from 'react';
import banner from 'https://www.utrgv.edu/newsroom/2019/05/images/utrgv-sign.jpg' // Import image from source
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook

const HomePage = () => {
    return (
        <body>
            {/* <!-- A flexible container using Bootstrap's d-flex class, 
            which applies Flexbox layout to its children --> */}
            <div class="d-flex">
                {/* <!-- Sidebar section (a collapsible navigation menu) -->
                <!-- 'flex-shrink-0' prevents the sidebar from shrinking when the page size changes (prob need to change this -E) -->
                <!-- 'p-3' adds padding (spacing) of 3 units inside the sidebar -->
                <!-- 'col-sm-0' makes the sidebar disappear on small screens (col-sm-0 hides it) (Need to also  change this -E) --> */}
                <div class="sidebar flex-shrink-0 p-3 col-sm-0" style="position: fixed; top: 0; left: 0; width: 150px;">
                    <ul class="nav flex-column">
                        {/* <!-- Each item in the navigation (sidebar) menu is a 'nav-item' --> */}
                        <li class="nav-item">
                            {/* <!-- The 'nav-link' class styles the anchor tags to look like navigation links -->
                            <!-- 'text-white' makes the text color white -->
                            <!-- 'bi bi-list' is a Bootstrap icon class, showing a list icon -->
                            <!-- 'font-size: 25px;' sets the icon size to 25 pixels --> */}
                            <a class="nav-link text-white bi bi-list" style="font-size: 25px;"></a>
                        </li>
                        {"\n"}
                        {/* <!-- Sidebar item: Home button --> */}
                        <li class="nav-item">
                            {/* <!-- 'bi bi-house-door' shows a house icon (from Bootstrap Icons) --> */}
                            <a class="nav-link text-white bi bi-house-door" style="font-size: 25px;"></a>
                            {/* <!-- Home text link below the icon --> */}
                            <a class ="nav-link text-white ">Home</a>
                        </li>
                    {/* <!-- Sidebar item: All button --> */}
                        <li class="nav-item">
                            {/* <!-- 'bi bi-grid' shows a grid icon -->
                            <!-- 'font-size: 20' sets the icon size --> */}
                            <a href="{{url_for('lab_devices')}}"class="nav-link text-white bi bi-grid" style="font-size: 20"></a>
                            {/* <!-- Text for 'All' --> */}
                            <a class ="nav-link text-white">All</a>
                        </li>
                        {/* <!-- For Add --> */}
                        <li class="nav-item">
                            {/* <!-- 'bi bi-plus-circle' shows a plus-circle icon --> */}
                            <a href="{{url_for('add')}}"class="nav-link text-white bi bi-plus-circle" style="font-size: 20" ></a>
                            <a class ="nav-link text-white">Add</a>
                        </li>
                        {/* <!-- Sidebar item: 'My Equipment' button --> */}
                        <li class = "nav-item">
                            {/* <!-- 'bi bi-box' shows a box icon --> */}
                            <a href="{{url_for('inventory')}}"class = "nav-link text-white bi bi-box" style="font-size: 20"></a>
                            <a class = "nav-link text-white">My Equipment</a>
                        </li>
                    </ul>
                </div>


                {/* <!-- Main content area -->

                <!-- 'container-fluid' is a full-width responsive container -->
                <!-- 'p-0' removes all padding inside the container --> */}

                {/* <!-- WORKING ON THIS PART - E --> */}
                {/* <!-- style="position: fixed; top: 0; left: 0; overflow-y: auto; margin-left: 1px" --> */}
                <div class="container-fluid p-0" >
                    {/* <!-- 'card' is a Bootstrap class to create a card (a bordered box) -->
                    <!-- 'mb-0' sets zero margin on the bottom of the card --> */}
                    <div class="card card-custom mb-0">
                        {/* <!-- 'card-body' adds padding and styles the content inside the card --> */}
                        <div class="card-body ">
                            {/* <!-- 'row' is a Bootstrap class to create a horizontal layout using a grid --> */}
                            <div class="row">
                                {/* <!-- 'col-sm-8' makes this element take up 8 columns on small screens and larger -->
                                <!-- Unicode character for pointing finger emoji --> */}
                                <div class="col-sm-8"><span style='font-size:20px; color:black'>&#129120;</span></div>
                                {/* <!-- 'col-sm-4' makes this element take up 4 columns on small screens and larger --> */}
                                <div class="col-sm-4">
                                    {/* <!-- 'd-flex' creates a Flexbox layout -->
                                    <!-- 'justify-content-end' pushes the content to the right --> */}
                                    <div class = "d-flex justify-content-end">
                                        <i>Change University</i> 
                                        {/* <!-- 'bi bi-paperclip' adds a paperclip icon --> */}
                                        <i class="text-black bi bi-paperclip mx-2"></i>
                                        {/* <!-- 'bi bi-calendar4-event' adds a calendar icon --> */}
                                        <i class="text-black bi bi-calendar4-event mx-2"> </i>
                                        {/* <!-- 'bi-three-dots-vertical' adds a vertical ellipsis icon --> */}
                                        <i class="text-black bi-three-dots-vertical mx-2"></i>
                                    </div>
                                </div>
                            </div>
                        </div>   
                    </div>
                

                    <div class="container" style="width: 80%; margin-left: 15%;">
                        {/* <!-- have content in here -->
                        <!-- Image container with fixed size and rounded corners --> */}
                        <div class="container-fluid">
                            <div class="card-body">
                                <div class="img-container">
                                    <img src={banner} alt="UTRGV logo banner"/>
                                    <div class="text-overlay">
                                        {/* <!-- Text overlay inside the image container --> */}
                                        <h1>Equipment Scheduler</h1>
                                        {"\n"}
                                    </div>
                                    {/* <!-- Button container --> */}
                                    <div class="button-container">
                                        {/* <!-- 'btn btn-light' adds light-colored button styling -->
                                        <!-- 'btn-custom' is the CSS I added --> */}
                                        <button class="btn btn-light btn-custom">
                                            <i class="bi bi-calendar4-event"></i> Add to my itinerary
                                        </button>
                                        <button class="btn btn-light btn-custom">
                                            <i class="bi bi-person-walking"></i> 12 min from current location
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                {/* <!-- Buttons for scheduling, history, and bookmarks --> */}

                        {/* <!-- 'text-center' centers the text horizontally --> */}
                        <div class="col text-center">
                            {/* <!-- Button group creates a set of buttons that appear next to each other --> */}
                            <div class="btn-group">
                                <button type="button" class="bi bi-check-lg btn btn-secondary text-dark btn btn-outline-dark buttons-right"> Scheduled</button>
                                <button type="button" class="bi bi-box btn  bg-light text-dark border-secondary"> History</button>
                                <button type="button" class=" bi bi-bookmark-fill btn  bg-light text-dark border-secondary buttons-left"> Bookmarks</button>
                            </div>
                        </div>
                        {"\n"}
                        {/* <!-- Cancel button and table for items --> */}
                        <div class="container">
                            {/* <!-- 'd-flex justify-content-end' aligns the button to the right --> */}
                            <div class = "d-flex justify-content-end mb-3">
                                {/* <!-- 'text-dark' makes the text dark -->
                                <!-- 'border-secondary' adds a gray border --> */}
                                <button type = "button" class = "text-dark border-secondary" style="width: 80px; height: 30px; color:gray">Cancel
                                </button>
                            </div>
                        </div>

                        {/* <!-- Table starts here --> */}
                        <div class="row" >
                            <div class="col">
                                <div style="max-height: 500px; overflow-y: auto;">
                                    {/* <!-- A responsive table --> */}
                                    <table class="table">
                                        <thead style="position: sticky; top: 0; background-color:#CB4900 ; z-index: 1;">
                                            <tr>
                                                {/* <!-- Table header --> */}
                                                <th> Image</th>
                                                <th>Item</th>
                                                <th>Description</th>
                                                <th>Time</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                {/* <!-- 'bi bi-image' shows an image icon -->
                                                <!-- 'font-size: 120px;' sets the icon size --> */}
                                                <td class="bi bi-image" style="font-size: 120px;"></td>
                                                <td>ITEM 1</td>
                                                <td>
                                                    {/* <!-- Inline icons for description --> */}
                                                    <div>
                                                        Model Info  
                                                        <span class="bi bi-dot"></span>
                                                        <span class="bi bi-clock"></span> 
                                                        <span class="bi bi-dot"></span> 
                                                        Building
                                                    </div>
                                                </td>
                                                    <td>Time Data</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                {/* <!-- 'bi bi-image' shows an image icon -->
                                                <!-- 'font-size: 120px;' sets the icon size --> */}
                                                <td class="bi bi-image" style="font-size: 120px;"></td>
                                                <td>ITEM 1</td>
                                                <td>
                                                    {/* <!-- Inline icons for description --> */}
                                                    <div>
                                                        Model Info  
                                                        <span class="bi bi-dot"></span>
                                                        <span class="bi bi-clock"></span> 
                                                        <span class="bi bi-dot"></span> 
                                                        Building
                                                    </div>
                                                </td>
                                                    <td>Time Data</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                {/* <!-- 'bi bi-image' shows an image icon -->
                                                <!-- 'font-size: 120px;' sets the icon size --> */}
                                                <td class="bi bi-image" style="font-size: 120px;"></td>
                                                <td>ITEM 1</td>
                                                <td>
                                                    {/* <!-- Inline icons for description --> */}
                                                    <div>
                                                        Model Info  
                                                        <span class="bi bi-dot"></span>
                                                        <span class="bi bi-clock"></span> 
                                                        <span class="bi bi-dot"></span> 
                                                        Building
                                                    </div>
                                                </td>
                                                    <td>Time Data</td>
                                                <td></td>
                                            </tr>
                                            <tr>
                                                {/* <!-- 'bi bi-image' shows an image icon -->
                                                <!-- 'font-size: 120px;' sets the icon size --> */}
                                                <td class="bi bi-image" style="font-size: 120px;"></td>
                                                <td>ITEM 1</td>
                                                <td>
                                                    {/* <!-- Inline icons for description --> */}
                                                    <div>
                                                        Model Info  
                                                        <span class="bi bi-dot"></span>
                                                        <span class="bi bi-clock"></span> 
                                                        <span class="bi bi-dot"></span> 
                                                        Building
                                                    </div>
                                                </td>
                                                    <td>Time Data</td>
                                                <td></td>
                                            </tr>
                                            
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </body>
    )
}
