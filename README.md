# Book'Em: University Equipment Scheduler
Collaborators: Ana Garcia, Amado Zuniga, Elvia Zamora Casique, Diane Lagare

Advisor: Dr. Marzieh Ayati

- [About](#about)
- [Project Overview](#project-overview)
- [Usage](#usage)
- [Execution](#execution)
- [Credit and Acknowledgments](#credits-and-acknowledgments)
  
# About 
Universities often house a vast array of equipment across multiple departments and laboratories. However, the lack of a centralized system to manage and share inventory information can result in inefficiencies. Faculty members and researchers frequently encounter challenges in determining whether specific equipment is available for their academic or research needs. This lack of visibility can lead to redundant purchases, misallocation of resources, and wasted time and funding. Addressing this issue is crucial for optimizing resource utilization and supporting collaborative academic endeavors.

# Project Overview 
Our project proposes a web-based equipment scheduler that functions as a centralized platform for inventory management and resource scheduling. This platform will allow users to:
* Search for available equipment across the university.
* View detailed information about equipment such as specifications and location.
* Schedule equipment usage through an integrated calendar system.
* Enable faculty to add new equipment to the inventory and update its availability.

By streamlining equipment visibility and scheduling, our solution aims to minimize redundant purchases, improve resource utilization, and foster collaboration among faculty and students. With its user-friendly interface and robust backend, the platform will serve as a cost-effective and efficient tool for managing equipment in an academic setting. This innovative approach not only addresses existing gaps but also positions the university as a model for effective resource management.

## Overview/Objective
**The motivation behind this project stems from the desire to improve resource efficiency in an academic setting.**

## Goals:
The primary goal of the Equipment Scheduler Web Service is to create a centralized platform that provides easy access to university equipment inventory, facilitating the scheduling and sharing of resources. The service aims to:​
* Enhance Usability: Design a user-friendly interface for quick equipment discovery and scheduling.​
* Improve Equipment Access: Provide faculty and researchers with up-to-date equipment availability, reducing redundancy and unnecessary purchases, and giving the department a clear overview of resource utilization and availability..​
* Prevent Scheduling Conflicts: Eliminate conflicts by enabling real-time updates and automatic reservation tracking, ensuring equipment is available when requested, and preventing double bookings.​
* Streamline Management: Implement an admin interface where faculty can create, read, update, and delete (CRUD) equipment entries, giving them full control over maintaining and managing the equipment inventory to ensure accuracy and up-to-date information.​
* Scalability: To be utilized across multiple universities and campuses.​
These goals reflect the project's aim to enhance equipment management and create a practical, easy-to-use tool that saves time and resources for the university.

## Potential Next Steps
* Plan to incorporate filtering of searches.
* Ability to switch universities and view their available equipment.
* Track equipment usage and create a equipment usage report for the admin
*  ​Calendar overview showcasing the user's booked equipment and calendar.
*  Integrated messaging system.
*  Real-time notifications when a booking request is approved, declined, or when a user makes a booking request.
*  Revenue opportunities, such as selling equipment through the application.
s within the framework using prompt engineering for direct bias evaluation.

# Current Bugs to be Addressed
1. Booking system is not fully complete. Although time-slots and calendar is color-coded when a user's booking is accepted, it is not reflected when an admin selects an array of unavailable time-slots and dates when they create/update equipment.
2. Need to add testing suites to ensure two users cannot book the same date/time.

# Execution 
1. Clone the repository to your desktop
2. Launch Visual Studio Code and open the cloned folder. 
3. In the terminal, type the following commands:
* **npm install**, to install node libraries.
* **npm install bootstrap**, to ensure bootstrap is accessible.
* **npm install nodemailer**, to ensure the messaging works.
4. Navigate to the /src folder in your terminal by using this command:
* cd ../src/
5. Open the browser using the following command in your terminal:
* **npm run start**

**Navigating the application**
1. If you are a new user, sign up and input valid credentials.
2. Select 'Student' or 'Staff' depending if you want to book equipment or make equipment available to book.
* Make sure email is a .edu email
3. If all is valid, a verification code will be sent to that email. You may need to check quarantined emails to get this code.
4. You are now able to view our current progress of the web application.

# Credits and Acknowledgments
* Diane Lagare (Collaborator)
* Ana Garcia (Collaborator)
* Amado Zuniga (Collaborator)
* Elvia Zamora Casique (Collaborator)
* Dr. Marizeth Ayati (Advisor)
