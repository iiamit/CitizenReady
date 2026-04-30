/**
 * Per-category narrative content for the "Story" lesson phase.
 * Drawn from the USCIS 2025 Civics Study Guide (M-1175, "One Nation, One People").
 *
 * Each section has:
 *   id     — unique key within the category
 *   title  — section heading (Playfair Display)
 *   body   — array of paragraphs (narrative text)
 *   image  — optional { src, caption, credit } (paths relative to BASE_URL)
 *
 * Image sources: Library of Congress, National Archives, USCIS, NASA.
 * All images are public-domain or government works.
 */

const NARRATIVES = {

  // ─────────────────────────────────────────────
  'constitution': {
    sections: [
      {
        id: 'founders-dilemma',
        title: "The Founders' Dilemma",
        body: [
          "After winning independence from Britain, the United States faced a new problem: 13 states behaving like 13 separate countries. They taxed each other, fought over debts, and ignored the weak central government. Some states were on the verge of going to war with each other.",
          "In the summer of 1787, leaders like George Washington, James Madison, Alexander Hamilton, and Benjamin Franklin gathered in Philadelphia for a Constitutional Convention. They were determined to fix the broken government — but they also feared what history had taught: giving one person too much power always led to tyranny. Their solution was to divide power into three branches so that no single person or group could dominate."
        ],
        image: {
          src: 'images/lesson/constitution/signing.jpg',
          caption: '"Scene at the Signing of the Constitution of the United States" by Howard Chandler Christy',
          credit: 'Library of Congress'
        }
      },
      {
        id: 'we-the-people',
        title: '"We the People"',
        body: [
          "The Constitution opens with three radical words: 'We the People.' Most governments of the era derived their authority from kings, emperors, or aristocracies. The American Founders declared something fundamentally different — that all government authority flows from the citizens themselves. This principle is called self-government, or popular sovereignty.",
          "The Preamble explains the purpose: to form a more perfect union, establish justice, ensure domestic peace, provide for the common defense, promote the general welfare, and secure the blessings of liberty — not just for the founding generation, but for all who came after."
        ],
        image: null
      },
      {
        id: 'bill-of-rights',
        title: 'The Fight for a Bill of Rights',
        body: [
          "When the finished Constitution was published in 1787, many Americans refused to ratify it — because it contained no list of individual rights. People feared a distant central government could silence dissent, search homes, and jail critics, just as the British had done.",
          "James Madison, Alexander Hamilton, and John Jay wrote 85 essays called the Federalist Papers, arguing the Constitution's structure would protect freedom. It wasn't enough. Supporters made a deal: ratify now, and we will immediately amend it to add a list of rights. In 1791, the first 10 amendments — the Bill of Rights — were added. They guarantee freedom of speech, religion, the press, and assembly, the right to a fair trial, and protection against unreasonable government searches."
        ],
        image: {
          src: 'images/lesson/constitution/ratification-map.jpg',
          caption: 'Map showing the 13 original states and when each ratified the Constitution (1787–1790)',
          credit: 'USCIS'
        }
      }
    ]
  },

  // ─────────────────────────────────────────────
  'branches': {
    sections: [
      {
        id: 'divide-and-balance',
        title: 'Divide and Balance',
        body: [
          "The Founders studied history carefully. Rome had fallen to one-man rule. Britain had a king. Every time power concentrated in one place, freedom died. Their answer was the separation of powers: divide government into three branches, each with different responsibilities, each able to check the others.",
          "The Constitution gives Congress the power to make laws, the President the power to enforce them, and the federal courts the power to review them. No single branch can dominate — each depends on the others, and each can restrain the others. This system of checks and balances is the architecture of American democracy."
        ],
        image: null
      },
      {
        id: 'peoples-house',
        title: 'The People\'s House',
        body: [
          "One of the most heated debates at the Constitutional Convention was about representation in Congress. Larger states wanted seats based on population. Smaller states demanded equal representation regardless of size. After weeks of argument, they reached the Great Compromise: a two-chamber Congress.",
          "The House of Representatives gives larger states more seats (435 members, proportional to population). The Senate gives every state exactly two senators (100 total) — so Wyoming and California have equal power there. Members of the House serve two-year terms, keeping them closely tied to public opinion. Senators serve six-year terms, providing more stability."
        ],
        image: {
          src: 'images/lesson/branches/capitol.jpg',
          caption: 'The United States Capitol in Washington, D.C. — meeting place of Congress',
          credit: 'USCIS'
        }
      },
      {
        id: 'executive-power',
        title: 'The President\'s Power and Its Limits',
        body: [
          "The Founders designed the presidency carefully. They gave the President real power — to sign or veto laws, command the military, appoint judges, negotiate treaties, and lead the executive branch. But they also built in limits. The President must follow the rule of law, just like every other citizen. No one is above the Constitution.",
          "The Cabinet — a group of senior advisors leading departments like Defense, State, and Homeland Security — helps the President govern. One of those departments, the Department of Homeland Security, is where USCIS (U.S. Citizenship and Immigration Services) operates. The agency conducting your naturalization interview is part of the executive branch."
        ],
        image: null
      },
      {
        id: 'independent-court',
        title: 'The Independent Court',
        body: [
          "The Founders wanted federal judges to make decisions based on the Constitution and the rule of law — not based on politics, elections, or the popularity of the moment. That is why federal judges are not elected. The President nominates them and the Senate confirms them, but once appointed, they serve for life.",
          "This independence gives the Supreme Court the ability to strike down laws passed by Congress and signed by the President if those laws violate the Constitution. The Supreme Court's nine justices have the final word on what the Constitution means — their decisions cannot be overturned by any other court."
        ],
        image: {
          src: 'images/lesson/branches/supreme-court-justices.jpg',
          caption: 'Supreme Court Justices Clarence Thomas and Antonin Scalia',
          credit: 'USCIS'
        }
      }
    ]
  },

  // ─────────────────────────────────────────────
  'laws': {
    sections: [
      {
        id: 'bill-to-law',
        title: 'How a Bill Is Born',
        body: [
          "The Constitution gives Congress — and only Congress — the power to make federal laws. When a member of Congress wants to create a new law, they write a proposal called a bill. That bill must pass both the House of Representatives and the Senate by majority vote before it can become law.",
          "The process is deliberately slow and difficult. A bill must survive committee hearings, floor debates, and votes in both chambers. The Founders believed that laws affecting every American should require broad agreement, not just a fleeting majority or a moment of popular passion."
        ],
        image: null
      },
      {
        id: 'veto-override',
        title: 'The Veto and the Override',
        body: [
          "Once Congress passes a bill, it goes to the President. If the President agrees, they sign it and it becomes law. If the President disagrees, they can veto it — refuse to sign — sending it back to Congress.",
          "But Congress has a check on presidential vetoes: if two-thirds of both the House and Senate vote again in favor of the bill, they can override the veto and make it law anyway. This back-and-forth between the branches is the system of checks and balances working exactly as the Founders designed."
        ],
        image: null
      }
    ]
  },

  // ─────────────────────────────────────────────
  'president': {
    sections: [
      {
        id: 'leading-the-nation',
        title: 'Leading the Nation',
        body: [
          "The President leads the executive branch, which is responsible for enforcing federal laws and running the daily operations of the U.S. government. The President's Cabinet — a group of advisors who lead the major executive departments — helps manage everything from defense and diplomacy to education, agriculture, and immigration.",
          "The Department of Homeland Security, which includes USCIS, is one of the 15 executive departments. The leaders of these departments are called Secretaries (except for the Attorney General, who leads the Department of Justice). Together, the Cabinet advises the President and carries out the laws Congress has passed."
        ],
        image: {
          src: 'images/lesson/president/cabinet.jpg',
          caption: "President Donald J. Trump's Cabinet, 2025",
          credit: 'USCIS'
        }
      },
      {
        id: 'commander-in-chief',
        title: 'Commander in Chief',
        body: [
          "The President is the Commander in Chief of the U.S. Armed Forces — the highest military authority in the country. This principle of civilian control of the military (a civilian, not a general, commands the troops) was central to the Founders' design. They had lived under British military rule and wanted to ensure the military always answered to elected civilian leadership.",
          "The U.S. Armed Forces have six branches: the Army, Navy, Marine Corps, Air Force, Coast Guard, and Space Force. Serving is voluntary; more than 2 million Americans serve today. Congress holds the power to declare war, but the President commands the military once war is declared."
        ],
        image: null
      },
      {
        id: 'term-limits',
        title: 'Term Limits and Succession',
        body: [
          "Presidents are elected for four-year terms and can serve at most two terms. This wasn't always the rule. Franklin Roosevelt was elected President four times, serving from 1933 to 1945. After his death, many felt that allowing unlimited terms gave one person too much power. In 1951, the 22nd Amendment was added to limit Presidents to two terms.",
          "The line of succession is clear: if the President cannot serve, the Vice President steps up. If both cannot serve, the Speaker of the House becomes President. George Washington established another key tradition — willingly stepping down after two terms — setting the precedent that no American leader should cling to power indefinitely."
        ],
        image: {
          src: 'images/lesson/president/washington-oath.jpg',
          caption: 'George Washington takes the Oath of Office at Federal Hall in New York City, 1789',
          credit: 'USCIS'
        }
      }
    ]
  },

  // ─────────────────────────────────────────────
  'rights-freedoms': {
    sections: [
      {
        id: 'missing-rights',
        title: 'Why Rights Had to Be Written Down',
        body: [
          "When the Constitution was published in 1787, many Americans feared it gave the new federal government too much power — and protected individuals too little. The British government had taxed them without consent, searched their homes without warrants, and jailed critics without trials. What would stop the new American government from doing the same?",
          "The debate was fierce. Some states refused to ratify the Constitution unless a bill of rights was added. James Madison, Alexander Hamilton, and John Jay wrote the Federalist Papers — 85 essays published in newspapers — arguing that the Constitution's balanced structure would protect freedom. But a promise was still needed: add a bill of rights, and we will ratify."
        ],
        image: {
          src: 'images/lesson/rights-freedoms/federalist-papers.jpg',
          caption: 'The Federalist Papers — essays urging ratification of the U.S. Constitution',
          credit: 'USCIS'
        }
      },
      {
        id: 'five-freedoms',
        title: 'Five Freedoms in One Amendment',
        body: [
          "In 1791, the Bill of Rights became part of the Constitution. The very first amendment protects five fundamental freedoms: religion (the right to practice any faith, or no faith), speech (the right to say or write what you believe), the press (the right of journalists and media to report freely), assembly (the right to gather peacefully), and petition (the right to ask the government to change its policies).",
          "These aren't just abstract rights — they are the tools of democracy. Without free speech, you cannot criticize the government. Without a free press, corruption goes unreported. Without the right of assembly, people cannot organize and demand change. These five freedoms are the foundation of an open society."
        ],
        image: {
          src: 'images/lesson/rights-freedoms/bill-of-rights.jpg',
          caption: 'The Bill of Rights to the U.S. Constitution',
          credit: 'National Archives'
        }
      },
      {
        id: 'rights-that-followed',
        title: 'Rights That Expanded Over Time',
        body: [
          "The Bill of Rights was just the beginning. Over the next two centuries, Americans amended the Constitution to expand who could vote and who was protected. The 13th Amendment (1865) abolished slavery. The 15th Amendment (1870) gave Black men the right to vote. The 19th Amendment (1920) gave women the right to vote. The 24th Amendment (1964) eliminated poll taxes that were used to prevent poor people from voting. The 26th Amendment (1971) lowered the voting age to 18.",
          "Each amendment represents a moment when Americans decided the promise of the Constitution had not yet been fully kept — and took action to close the gap."
        ],
        image: null
      }
    ]
  },

  // ─────────────────────────────────────────────
  'voting': {
    sections: [
      {
        id: 'who-could-vote',
        title: 'Who Could Vote — and When',
        body: [
          "In the early United States, only white men who owned property could vote. This was a far cry from the ideals of the Declaration of Independence, which proclaimed that all men were created equal. Over time, through protest, legislation, and constitutional amendments, voting rights expanded to include nearly every adult citizen.",
          "Four constitutional amendments reshaped voting rights: the 15th Amendment (1870) said race could not prevent a citizen from voting; the 19th Amendment (1920) gave women the vote; the 24th Amendment (1964) abolished the poll tax used to block poor voters; and the 26th Amendment (1971) lowered the voting age from 21 to 18, partly because young people were being drafted to fight in Vietnam without being allowed to vote."
        ],
        image: null
      },
      {
        id: 'civic-responsibility',
        title: 'Your Civic Responsibility',
        body: [
          "Voting in federal elections is a right that belongs only to U.S. citizens. When citizens vote, they elect U.S. Representatives, U.S. Senators, and the President — the people who make and enforce the laws that govern every aspect of American life.",
          "Beyond voting, civic participation includes attending town halls, writing to elected officials, serving on juries, and staying informed. The Founders believed that self-government only works if citizens are actively engaged. As Thomas Jefferson wrote, an informed citizenry is the foundation of democracy."
        ],
        image: null
      }
    ]
  },

  // ─────────────────────────────────────────────
  'rights-resp': {
    sections: [
      {
        id: 'oath-of-allegiance',
        title: 'The Oath of Allegiance',
        body: [
          "The United States has welcomed immigrants from every corner of the world. People have come seeking freedom from persecution, opportunity for their families, and a chance to build a new life. Naturalization is the process by which immigrants become U.S. citizens.",
          "At a naturalization ceremony, applicants raise their right hand and take the Oath of Allegiance — promising to give up loyalty to foreign governments, defend the Constitution, obey the laws of the United States, and be loyal to their new country. In that moment, they become full citizens with all the rights and responsibilities that come with citizenship."
        ],
        image: {
          src: 'images/lesson/rights-freedoms/naturalization.jpg',
          caption: 'Applicants for naturalization take the Oath of Allegiance at a naturalization ceremony',
          credit: 'USCIS'
        }
      },
      {
        id: 'two-way-street',
        title: 'Citizenship Is a Two-Way Street',
        body: [
          "Being a U.S. citizen means more than having rights — it also means accepting responsibilities. Everyone living in the United States is required to obey the law, pay taxes, and respect the rights of others. Citizens have additional responsibilities: serving on juries when called, and registering with the Selective Service (for men between ages 18–26).",
          "The most important civic responsibility is participation. Voting, staying informed about government, and contributing to your community are how citizens make democracy work. Rights and responsibilities are two sides of the same coin — you cannot fully enjoy one without honoring the other."
        ],
        image: null
      }
    ]
  },

  // ─────────────────────────────────────────────
  'geography': {
    sections: [
      {
        id: 'thirteen-to-fifty',
        title: 'From 13 Colonies to 50 States',
        body: [
          "When the United States declared independence in 1776, there were 13 original states — all on the East Coast. Over the next 183 years, the country grew dramatically, through purchase, war, and negotiation, until it spanned a continent and two oceans.",
          "Today the U.S. has 50 states. The 50th — Hawaii — became a state on August 21, 1959. There are also five territories (Puerto Rico, Guam, U.S. Virgin Islands, American Samoa, and the Northern Mariana Islands) that are part of the United States but are not states. This is why the flag has 50 stars — one for each state."
        ],
        image: {
          src: 'images/lesson/geography/us-map.jpg',
          caption: 'The 50 U.S. states, Washington D.C., and the 5 U.S. territories',
          credit: 'USCIS'
        }
      },
      {
        id: 'americas-landscape',
        title: "America's Landscape",
        body: [
          "The United States stretches from the Atlantic Ocean on the East Coast to the Pacific Ocean on the West Coast. Canada borders the U.S. to the north across 13 states; Mexico borders it to the south across four states (California, Arizona, New Mexico, and Texas).",
          "Two great mountain ranges define the geography: the Appalachian Mountains in the east and the Rocky Mountains in the west. The two longest rivers are the Mississippi River, which runs north to south through the middle of the country, and the Missouri River, which flows eastward from the western states to meet the Mississippi. The nation's capital, Washington, D.C., sits between Maryland and Virginia on the East Coast — it is not part of any state."
        ],
        image: null
      }
    ]
  },

  // ─────────────────────────────────────────────
  'state-local': {
    sections: [
      {
        id: 'shared-power',
        title: 'Shared Power: Federalism',
        body: [
          "The Constitution divides power between the federal government and state governments — a system called federalism. The federal government handles national concerns: printing money, declaring war, regulating foreign trade, and making treaties. But the 10th Amendment reserves significant power for states and for the people.",
          "States have their own legislative, executive, and judicial branches, mirroring the federal structure. They control things the federal government does not: running public schools, licensing drivers, setting zoning laws, operating police departments and fire departments, and managing most criminal law. This local control means policies can reflect the needs and values of specific communities."
        ],
        image: null
      },
      {
        id: 'governor-and-capital',
        title: 'Your Governor and State Capital',
        body: [
          "Each of the 50 states has a governor — the executive leader of the state government, equivalent to the President at the national level. Governors are elected by the people of their state. Washington, D.C., is not a state, so it has no governor.",
          "Every state also has its own capital city, which is where the state legislature meets and the governor works. State capitals are often not the largest cities in the state — for example, Albany is New York's capital, not New York City; Sacramento is California's capital, not Los Angeles. Knowing your state capital and governor is part of the civics test."
        ],
        image: null
      }
    ]
  },

  // ─────────────────────────────────────────────
  'colonial': {
    sections: [
      {
        id: 'first-inhabitants',
        title: 'A Continent Already Inhabited',
        body: [
          "Long before Europeans arrived, North and South America were home to more than 50 million people. Native Americans had lived on this land for approximately 20,000 years, building diverse civilizations — from nomadic hunting cultures of the Great Plains to city-building societies with complex governments and written languages in Mesoamerica.",
          "When European explorers arrived in the late 1400s and 1500s, they brought diseases — smallpox, measles, influenza — to which Native Americans had no immunity. Tens of millions died. By the 1600s, the Native American population had collapsed from over 50 million to roughly 6 million, one of the greatest demographic catastrophes in human history."
        ],
        image: {
          src: 'images/lesson/colonial/pomeiock.jpg',
          caption: 'Illustration of the Native American town of Pomeiock by John White (c. 1585)',
          credit: 'Jamestown Yorktown Foundation'
        }
      },
      {
        id: 'jamestown',
        title: 'Jamestown and the Dark Chapter',
        body: [
          "In 1607, England established Jamestown, Virginia — the first permanent English settlement in North America. The colonists came for economic opportunity: cheap land, fertile soil, and the chance to grow profitable crops like tobacco and cotton. The early years were brutal. Starvation, disease, and conflicts with Native Americans killed most of the first settlers.",
          "As the colony grew, landowners needed more workers than they could recruit from Europe. In 1619, the first group of enslaved Africans arrived in Jamestown, purchased from a Dutch ship. Over the next two centuries, millions of Africans would be forcibly taken from their homes, transported across the Atlantic in horrific conditions, and forced to labor on American plantations. Slavery became the foundation of the Southern colonial economy."
        ],
        image: {
          src: 'images/lesson/colonial/jamestown.jpg',
          caption: 'A scene of Jamestown around 1650',
          credit: 'National Park Service'
        }
      },
      {
        id: 'no-taxation',
        title: 'No Taxation Without Representation',
        body: [
          "By the 1760s, England (now Great Britain) was deeply in debt from wars in Europe and North America. To raise money, Parliament passed new tax laws targeting the 13 American colonies. The colonists were furious: they were being taxed without having any representatives in Parliament to vote on those taxes. 'No taxation without representation' became their rallying cry.",
          "Great Britain responded by sending more troops and punishing the colonies. The colonists responded by boycotting British goods, holding protests, and eventually forming their own armies. In 1775, fighting broke out in Massachusetts. George Washington was named commander of the colonial army. All 13 colonies united against Britain in what became the American Revolutionary War."
        ],
        image: {
          src: 'images/lesson/colonial/washington-command.jpg',
          caption: '"Washington Taking Command of the American Army" by Currier & Ives',
          credit: 'National Archives'
        }
      },
      {
        id: 'declaration',
        title: 'The Declaration and What It Meant',
        body: [
          "On July 4, 1776 — while the Revolutionary War was still being fought — the Continental Congress adopted the Declaration of Independence, written primarily by Thomas Jefferson. It was more than a political document: it was a moral statement about the nature of government and human dignity.",
          "Jefferson wrote that all people are 'created equal' and possess 'unalienable rights' — including 'Life, Liberty, and the pursuit of Happiness.' These rights were not granted by kings or governments; they were inherent in being human. If a government fails to protect these rights, the people have the right to change or abolish it. The Declaration inspired revolutions and independence movements around the world for centuries to come."
        ],
        image: {
          src: 'images/lesson/colonial/declaration.jpg',
          caption: 'The Declaration of Independence',
          credit: 'National Archives'
        }
      }
    ]
  },

  // ─────────────────────────────────────────────
  'civil-war': {
    sections: [
      {
        id: 'slaverys-shadow',
        title: "Slavery's Long Shadow",
        body: [
          "By the mid-1800s, the Southern states' economy was built almost entirely on cotton and other crops grown by enslaved people. As the United States expanded westward, the question of whether slavery would be legal in new states and territories tore the country apart. Northern states had mostly abolished slavery; Southern states feared the North would force abolition everywhere.",
          "Congress passed a series of compromises trying to hold the union together, but the tension only grew. The fundamental question — whether human beings could be legally owned as property — could not be compromised away forever."
        ],
        image: {
          src: 'images/lesson/civil-war/civil-war-battle.jpg',
          caption: 'Civil War Battle of Antietam, 1862',
          credit: 'USCIS'
        }
      },
      {
        id: 'voices-before',
        title: 'Voices Before the War',
        body: [
          "Frederick Douglass was born into slavery and escaped at age 20. He became one of the most powerful orators and writers of the 19th century, traveling the world to lecture on the evils of slavery and the urgent need for abolition. His autobiography and speeches gave a human face to the suffering of enslaved people and helped shift public opinion in the North.",
          "Susan B. Anthony was a white abolitionist who also understood that the fight for freedom could not ignore women. She worked alongside Douglass against slavery and led the decades-long campaign for women's suffrage, arguing that a democracy that denied half its citizens the right to vote was no democracy at all."
        ],
        image: {
          src: 'images/lesson/civil-war/douglass.jpg',
          caption: 'Frederick Douglass — abolitionist and civil rights leader',
          credit: 'National Park Service'
        }
      },
      {
        id: 'lincoln-and-war',
        title: 'Lincoln and a Nation at War',
        body: [
          "In 1861, eleven Southern states left the United States and declared themselves the Confederate States of America. The Civil War — fought between the Union (the North) and the Confederacy (the South) — lasted four brutal years and killed over 600,000 Americans, more than any other war in U.S. history.",
          "Abraham Lincoln, the 16th President, led the Union through the war. In 1863, he issued the Emancipation Proclamation, declaring that enslaved people in Confederate states were free. Though it did not immediately free everyone (it applied to states in rebellion, not border states), it transformed the war's purpose: it was now not just a fight to preserve the union, but a fight to end slavery."
        ],
        image: {
          src: 'images/lesson/civil-war/lincoln.jpg',
          caption: 'Abraham Lincoln, 16th President of the United States',
          credit: 'Library of Congress'
        }
      },
      {
        id: 'freedom-at-last',
        title: 'Freedom at Last',
        body: [
          "The South surrendered in April 1865. On June 19, 1865, enslaved people in Galveston, Texas — among the last to receive the news — learned they were free. That date became Juneteenth, now a national holiday that commemorates the end of slavery in the United States.",
          "On December 6, 1865, the 13th Amendment was ratified, making slavery illegal throughout the entire country. Three more amendments followed: the 14th (1868) granted citizenship and equal protection under the law to all persons born in the U.S., including formerly enslaved people; and the 15th (1870) prohibited denying the vote based on race. Four days after the South's surrender, Abraham Lincoln was assassinated."
        ],
        image: {
          src: 'images/lesson/civil-war/anthony.jpg',
          caption: 'Susan B. Anthony — abolitionist and suffragist',
          credit: 'Library of Congress'
        }
      }
    ]
  },

  // ─────────────────────────────────────────────
  'recent-history': {
    sections: [
      {
        id: 'world-stage',
        title: 'America Enters the World Stage',
        body: [
          "By 1900, the United States had industrialized rapidly. Millions of immigrants poured in from Europe, Asia, and Latin America, filling factories, building railroads, and reshaping American culture. In 1917, the U.S. entered World War I on the side of France and Britain, helping bring the war to an end in November 1918.",
          "World War I ended on the 11th hour of the 11th day of the 11th month of 1918. That date — November 11 — became Veterans Day, a national holiday honoring all who have served in the U.S. military. It was originally called Armistice Day, marking the ceasefire that ended 'the Great War.'"
        ],
        image: {
          src: 'images/lesson/recent-history/wwi-trenches.jpg',
          caption: 'American soldiers in a trench in France during World War I',
          credit: 'Library of Congress'
        }
      },
      {
        id: 'depression-wwii',
        title: 'Depression, FDR, and World War II',
        body: [
          "In 1929, the U.S. stock market crashed, triggering the Great Depression — the worst economic collapse in American history. Banks closed, factories shut down, and millions lost their jobs and homes. Franklin D. Roosevelt, elected President in 1932, responded with the New Deal: a massive series of government programs to provide relief and rebuild the economy. FDR was elected President four times and served until his death in 1945.",
          "On December 7, 1941, Japan attacked the U.S. naval base at Pearl Harbor, Hawaii, killing over 2,400 Americans. The next day, the U.S. declared war. For four years, Americans fought in Europe and the Pacific against Germany, Japan, and Italy alongside Britain, France, Russia, and other Allies. World War II ended in 1945 when Germany and Japan surrendered."
        ],
        image: {
          src: 'images/lesson/recent-history/pearl-harbor.jpg',
          caption: 'Bombing of USS West Virginia at Pearl Harbor, Hawaii, December 7, 1941',
          credit: 'Library of Congress'
        }
      },
      {
        id: 'civil-rights',
        title: 'The Civil Rights Movement',
        body: [
          "Even after the Civil War and constitutional amendments, many states — especially in the South — maintained laws that segregated Black Americans from white Americans in schools, restaurants, buses, and neighborhoods. Poll taxes, literacy tests, and outright violence kept Black citizens from voting.",
          "In the 1950s and 60s, a massive Civil Rights Movement swept the country. Martin Luther King Jr. led peaceful marches and gave powerful speeches — including his 'I Have a Dream' speech at the 1963 March on Washington, attended by over 250,000 people. Congress responded with the Civil Rights Act of 1964 (banning racial discrimination in public life) and the Voting Rights Act of 1965 (protecting voting rights). Latino leaders Cesar Chavez and Dolores Huerta also fought for civil rights and fair wages for farmworkers."
        ],
        image: {
          src: 'images/lesson/recent-history/mlk-march.jpg',
          caption: 'The March on Washington for Jobs and Freedom, August 28, 1963',
          credit: 'Library of Congress'
        }
      },
      {
        id: 'september-11',
        title: 'September 11, 2001',
        body: [
          "On the morning of September 11, 2001, 19 terrorists hijacked four commercial airplanes. Two crashed into the Twin Towers of the World Trade Center in New York City; one hit the Pentagon near Washington, D.C.; and a fourth crashed in a field near Shanksville, Pennsylvania, after passengers fought back against the hijackers.",
          "Nearly 3,000 people were killed — Americans and people from more than 90 countries. It was the deadliest attack on American soil since Japan's attack on Pearl Harbor in 1941. The attacks led to major changes in U.S. security, intelligence, and foreign policy, including the creation of the Department of Homeland Security."
        ],
        image: {
          src: 'images/lesson/recent-history/911-pentagon.jpg',
          caption: 'Firefighters at the Pentagon on September 12, 2001',
          credit: 'White House / Paul Morse'
        }
      }
    ]
  },

  // ─────────────────────────────────────────────
  'symbols-holidays': {
    sections: [
      {
        id: 'gift-of-liberty',
        title: 'The Gift of Liberty',
        body: [
          "In 1886, the people of France gave the United States an extraordinary gift: the Statue of Liberty. The statue — a woman holding a torch in her right hand and a tablet inscribed 'July 4, 1776' in her left — stands on Liberty Island in New York Harbor and has welcomed millions of arriving immigrants for over a century.",
          "The statue is a symbol of freedom and democracy. France gave it as a gesture of friendship between two republics that believed in the ideals of liberty and self-government. To this day, over 4 million people from around the world visit the Statue of Liberty each year."
        ],
        image: {
          src: 'images/lesson/symbols-holidays/statue-liberty.jpg',
          caption: 'The Statue of Liberty on Liberty Island, New York Harbor',
          credit: 'Library of Congress'
        }
      },
      {
        id: 'immigrant-gateways',
        title: 'The Immigrant Gateways',
        body: [
          "For millions of immigrants, their first sight of America was Ellis Island — an immigration station in New York Harbor that processed more than 12 million arrivals between 1892 and 1954. The Great Hall at Ellis Island was the first American room many immigrants ever entered, after weeks at sea.",
          "On the West Coast, Angel Island in San Francisco Bay served a similar role from 1910 to 1940, processing nearly 1 million immigrants who crossed the Pacific — many of them from China, Japan, Korea, and the Philippines. Ellis Island and Angel Island are now national historic sites. Many Americans can trace their family stories through these two gateways."
        ],
        image: {
          src: 'images/lesson/symbols-holidays/ellis-island-hall.jpg',
          caption: 'The Great Hall at Ellis Island immigration station',
          credit: 'USCIS'
        }
      },
      {
        id: 'flag-story',
        title: "The Flag's Story",
        body: [
          "The American flag tells the story of the nation's history. It has 13 red and white stripes, representing the 13 original colonies that declared independence in 1776. It has 50 stars — one for each of the 50 states. Each time a new state joined the Union, a star was added.",
          "The national anthem, 'The Star-Spangled Banner,' was written by Francis Scott Key during the War of 1812, after he watched the American flag survive a night of British bombardment at Fort McHenry in Baltimore. The word 'spangled' refers to how the stars appeared to shine in the night sky. Congress officially made it the national anthem in 1931."
        ],
        image: {
          src: 'images/lesson/symbols-holidays/american-flag.jpg',
          caption: 'The American flag — 13 stripes for the original colonies, 50 stars for the states',
          credit: 'USCIS'
        }
      },
      {
        id: 'days-we-remember',
        title: 'Days We Remember',
        body: [
          "America's national holidays are not just days off — they're stories of sacrifice, struggle, and celebration. Memorial Day (last Monday in May) honors those who died in military service. Veterans Day (November 11) honors all who have served. Independence Day (July 4) celebrates the Declaration of Independence. Juneteenth (June 19) marks the end of slavery. Thanksgiving (fourth Thursday in November) traces back to a 1621 harvest feast shared by English colonists and the Wampanoag people.",
          "Martin Luther King Jr. Day (third Monday in January) honors the civil rights leader. Presidents' Day (third Monday in February) honors George Washington and Abraham Lincoln, born in February. Each holiday is a thread in the fabric of American memory — a reminder of where the country has been and what it has stood for."
        ],
        image: {
          src: 'images/lesson/symbols-holidays/arlington-cemetery.jpg',
          caption: 'Arlington National Cemetery — honoring those who died in service to the United States',
          credit: 'USCIS'
        }
      }
    ]
  }

};

/**
 * Returns the narrative object for a category, or null if none exists.
 */
export function getNarrative(categoryId) {
  return NARRATIVES[categoryId] ?? null;
}

/**
 * Returns all images from a category's narrative sections,
 * flattened into an array suitable for gallery display.
 * Images without a src are filtered out.
 */
export function getVisualPhotos(categoryId) {
  const narrative = NARRATIVES[categoryId];
  if (!narrative) return [];
  return narrative.sections
    .filter(s => s.image && s.image.src)
    .map(s => s.image);
}
