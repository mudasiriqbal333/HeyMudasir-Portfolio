# SIMuSPACE

Slug `simuspace` · 7 pictures in `public/assets/simuspace/`, served at `/assets/simuspace/<file>`.
Live site: https://simuspace.ai/ (SOCO engineers GmbH, Munich; development offices in Multan and Lahore).
The title carries the line "Powered by BMW" (`tagline`), on the project page and in the Work and Home lists.

| file | pixels | used for | from |
|---|---|---|---|
| sign-in.webp | 1440x810 | hero | the owner's export `Sign in@1x.png`: the sign-in page for the BMW Group, saved as WebP |
| license-monitoring.png | 1638x1024 | laptop, first (held longest) | `License Monitoring – new UI@1x.png` |
| workflow-designer.png | 1638x1024 | laptop 2 and moving row | `Workflow designer – new UI@1x.png` |
| qa-dyna-charts.png | 1638x1024 | laptop 3 and moving row | `QA_Dyna charts – new UI@1x.png` |
| post-processing-workflow.png | 1638x1024 | laptop 4 and moving row | `Post_Processing workflow – new UI@1x.png` |
| optimization-results.png | 1638x1024 | laptop 5 and moving row | `Optimization results – new UI@1x.png` |
| thumbnail.png | 1200x1200 | previews | the owner's design `Portfolio thumbnail@1x.png`; its navy #0a1033 is also the page colour behind the laptop |

The five app screens were exported at 1366x1024 (4:3). They are widened to the
laptop's 16:10 by repeating their own light-grey background at the left and
right edges, so the laptop shows no black bars; nothing in the screens is
changed. The owner's exports are kept as they are in
`originals/public/assets/simuspace/new-ui/`. Not used any more, kept in
`originals/public/assets/simuspace/`: the old marketing banner (`01.png`,
`banner.webp`) and every image of the product site (`site/`).

## What the owner did

End-to-end front-end revamp of the whole product, plus the data analytics:
Power BI-like dashboards built with Apache ECharts (and Plotly), kept fast on
large simulation data with memoization and React hooks. Engineering and
research teams at BMW use the tool.

## From Moiz Project Portfolio.docx


### SIMuSPACE


### The Challenge:

Our team at SOCO engineers set out to develop a comprehensive product that addresses the complex data management and workflow needs of large-scale enterprises, such as BMW. The challenge was to design a scalable and modular system that could seamlessly integrate with existing IT infrastructures while supporting multidisciplinary simulations and processes across various departments.

Key challenges included:

Data Management: The system needed to handle diverse data types, provide version control, enable local and server synchronisation, and allow third-party applications to open files directly within the system. In addition, it had to support traceability of data changes and ensure efficient collaboration across multiple locations.

Workflow Standardisation: We needed to create a workflow management system capable of standardising complex user processes, embedding third-party software, controlling high-performance computing (HPC) clusters, and protecting intellectual property (IP). The system also had to ensure version control and lifecycle management of workflow templates while integrating with external databases.

Dynamic Data Analytics: Another challenge was to create dynamic dashboards similar to Power BI and Tableau for data analytics, with robust visualisation capabilities that could process and display complex simulation data from various engineering disciplines.


### The Solution:


### Smart SDM with a Powerful Workflow Manager

To meet these challenges, our team developed SIMuSPACE, an advanced Smart SDM with a modular, scalable architecture designed for data management and workflow standardisation. Built with a technology stack of Java, Next.js, Postgres, and Vanilla JavaScript, SIMuSPACE was tailored to the specific needs of industries such as automotive engineering.

Data Management Module

SIMuSPACE offers a flexible configuration of data types and properties based on customer requirements. The system supports both highly standardised and individual data objects, allowing engineers to work locally with automatic server synchronisation.

Core functionalities include version control, CheckIn/CheckOut of objects, and data traceability, ensuring every change is tracked and retrievable. Additionally, third-party applications are integrated into the system, enabling users to open preconfigured files directly.

Workflow Manager

The workflow manager was designed to standardise any complex user process while embedding third-party software, such as commercial CAE (Computer-Aided Engineering) tools.

The system controls HPC clusters, manages the versioning and lifecycle of workflow templates, and ensures intellectual property protection. The role-based access control system ensures only authorised personnel can manage or edit workflows, making the system secure and reliable.

By interacting with external databases and data management systems, the workflow manager integrates seamlessly into a company’s larger IT ecosystem.

Dynamic Data Analytics

Our team built a dynamic dashboard for data analytics using Apache ECharts and Plotly, providing engineers with powerful tools to visualise and interpret complex simulation data.

The dashboards offer intuitive, real-time visualisations of multidisciplinary simulations, allowing for deeper insights into engineering data, similar to the capabilities provided by platforms like Power BI and Tableau.

Modular and Scalable Architecture

SIMuSPACE’s open and scalable structure allows it to be easily integrated into any existing IT infrastructure. Its plug-in architecture supports the connection of various development tools, enabling continuous product development across multiple engineering disciplines. The system’s modularity ensures that new features and tools can be added without disrupting existing operations, making it highly adaptable to evolving business needs.


### The Result:

SIMuSPACE has been widely adopted, especially by companies like BMW, due to its robust, scalable, and customizable features. The key outcomes include:

Improved Data Management: The system’s ability to version, trace, and manage data across different teams and locations improved collaboration and operational efficiency. Engineers could confidently work on the same data set with local synchronisation and centralised server control.

Streamlined Workflows: The workflow manager standardised complex processes, helping teams execute multidisciplinary simulations with greater consistency and control. The integration with external databases and CAE tools improved operational speed and decision-making.

Enhanced Data Analytics: The dynamic dashboard, built with Apache ECharts and Plotly, allowed users to visualise complex simulation data in real-time, offering insights that facilitated better engineering outcomes. The intuitive visualisations proved essential for decision-making across various stages of the product development lifecycle.

Scalability and Flexibility: The modular structure of SIMuSPACE allowed it to grow alongside the evolving needs of clients, like BMW. Its ability to integrate new tools and expand across multiple locations demonstrated the platform’s long-term scalability and flexibility.

SIMuSPACE successfully addressed the challenges of data management and workflow optimization, becoming a valuable tool for CAE engineers and industries focused on large-scale, multidisciplinary product development.
