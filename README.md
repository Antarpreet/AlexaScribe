# AlexaScribe
### Inspiration:
As a student I'm always stuck between if I should focus on understanding what the instructor is trying to teach in class or should I be focusing on taking notes trying to keep them organized so that I can go through them once I reach home, which rarely happens.
Even if I do manage to make notes, it's hard to keep them organized and query through them. I always wanted someone who I can ask anytime what was this topic about or what is that without having to resort to a browser. In the AI driven world and through availability of correct resources I was able to make AlexaScribe.


### What it does:
AlexaScribe integrates into the usual classroom setting without disturbing anyone.
Transcribes all the things which were said by the instructor and provides you text and audio through which you can query like..
What is Macroevolution?
What is the First law of thermodynamics?
What is the meaning of Arbitrage?
Hey Alexa what was the value of "this"?

### How I built it:
The application was built with the following technologies:

	• Backend – AWS Lambda service to connect with Alexa 
	• Hardware - Alexa
	• Database – MongoDB  with node work really well with NoSQL non-relational databases.
  


### Challenges I ran into:
As this prototype was built within 24 hours, there were a lot of challenges that I ran into. 
As I was creating a transcription application, I wanted to make sure that I can keep an Alexa session active for longer than a just few seconds so I had read over a lot of documentation and finally I was able to change a few setting within the Alexa skill source code that let me keep the existing interactions active for longer.

Next was querying over the notes dataset. When the user asks a question, I extract the intent of that question and then perform a search over the saved notes dataset to ensure that I can get the more accurate response back.
