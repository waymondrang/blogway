export const mockBlogs = [
    {
        blogId: "hello-world",
        coWriters: ["tewi", "izzy"],
        content: `
<h1>Level 01: PILLAR OF AUTUMN</h1>
<h2>Part 01 : Pillar of Autumn</h2>
<p>Vital signs look normal. No freezer burn. Okay, sir, go ahead and climb out of the cryo tube. (Pause as the Chief climbs out) I gave you a double-dose of the wakeup stim. Take a quick walk around the cryo bay and join me at the optical diagnostics station when you're ready. (pause) Stand on the red square please. I know the ordinance techs usually take care of your targeting sensors, but we're short of time, Chief. Just look at each of the flashing panels to target them. When you lock on, it'll target them.</p>
<p> Sir, I'm getting some calibration errors. I'm going to invert your looking pitch, so you can see if you like it better that way. Try targeting the flashing lights again. Is that better or should I switch it back? Okay. Try looking up and down again please. Do you want me to leave it like that, or switch it again? Okay, I'll leave the pitch normal. But if you want, you can change it yourself, later. I'm ready for the energy shield test now.</p>
        `,
        uploadDate: new Date().toISOString(),
    },
    {
        blogId: "three-authors",
        guestWriter: "anonymous",
        content: `
<h1>Halo Installations</h1>
<p> For exactly 101 217 local years, it lay forgotten and derelict in a disused portion of space. Sedentary, save for the unrelenting pull of Basis and Threshold, Halo was a testament to its builders' technological capabilities. It was constructed to withstand innumerable millennia, and this superannuated edifice certainly shows that the Forerunner were very capable at their craft. So Installation 04 sat; a facility left derelict for eons by its makers, yet visited and documented by numerous races throughout its quiescent past. Not till recently, however, was its purpose dredged from its depths. </p>
        `,
        uploadDate: new Date(Date.now() - 10000).toISOString(),
    },
];
