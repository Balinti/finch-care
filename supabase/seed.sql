-- Finch Care Seed Data

-- Seed path_days (30 days of anxiety skills content)
INSERT INTO path_days (day_number, title, free, preview_md) VALUES
(1, 'Understanding Anxiety', true, 'Learn what anxiety actually is and why your body responds the way it does.'),
(2, 'The Anxiety Response', true, 'Explore the fight-flight-freeze response and why it''s actually trying to help you.'),
(3, 'Breathing Basics', true, 'Introduction to diaphragmatic breathing - your first portable calming tool.'),
(4, 'Grounding Techniques', true, 'Learn the 5-4-3-2-1 technique and other ways to anchor yourself in the present.'),
(5, 'Thought Awareness', true, 'Begin noticing your thoughts without getting caught up in them.'),
(6, 'Self-Compassion Start', true, 'Why being kind to yourself isn''t weakness - it''s science.'),
(7, 'Week 1 Review', true, 'Consolidate what you''ve learned and celebrate your progress.'),
(8, 'Cognitive Distortions', false, 'Common thinking traps that fuel anxiety and how to spot them.'),
(9, 'Challenging Thoughts', false, 'Gentle techniques to question anxious predictions.'),
(10, 'Worry Time', false, 'A structured approach to containing worry to specific times.'),
(11, 'Progressive Relaxation', false, 'Systematic muscle relaxation for physical tension release.'),
(12, 'Mindful Awareness', false, 'Introduction to present-moment awareness without judgment.'),
(13, 'Values Exploration', false, 'What matters to you beyond anxiety?'),
(14, 'Week 2 Review', false, 'Reflect on your growing toolkit and progress.'),
(15, 'Avoidance Patterns', false, 'Understanding how avoidance maintains anxiety.'),
(16, 'Gentle Exposure', false, 'Small steps toward what you''ve been avoiding.'),
(17, 'Safety Behaviors', false, 'Subtle things you might do that keep anxiety going.'),
(18, 'Acceptance Basics', false, 'Making room for discomfort without fighting it.'),
(19, 'Defusion Techniques', false, 'Creating distance from unhelpful thoughts.'),
(20, 'Body Scan Practice', false, 'Learning to notice bodily sensations with curiosity.'),
(21, 'Week 3 Review', false, 'Integrate acceptance and exposure concepts.'),
(22, 'Sleep and Anxiety', false, 'How sleep and anxiety interact, and what helps.'),
(23, 'Lifestyle Factors', false, 'Movement, nutrition, and other anxiety influencers.'),
(24, 'Social Anxiety Tools', false, 'Specific strategies for social situations.'),
(25, 'Panic Response', false, 'Understanding and responding to panic attacks.'),
(26, 'Building Resilience', false, 'Creating a sustainable relationship with uncertainty.'),
(27, 'Support Systems', false, 'How to talk about anxiety and when to seek help.'),
(28, 'Maintenance Planning', false, 'Creating your ongoing anxiety management plan.'),
(29, 'Setback Strategies', false, 'What to do when anxiety increases - it''s not failure.'),
(30, 'Path Complete', false, 'Celebrating your journey and looking ahead.')
ON CONFLICT (day_number) DO NOTHING;

-- Seed path_lessons (one lesson per day)
INSERT INTO path_lessons (day_number, content_md, est_minutes) VALUES
(1, '## What Is Anxiety?

Anxiety is your body''s natural alarm system. When it senses potential danger, it activates to protect you. This response has kept humans alive for thousands of years.

**Key points:**
- Anxiety is normal and universal
- It becomes problematic when it''s too frequent, intense, or disconnected from real threats
- Your brain can''t always tell the difference between physical and social threats

**Practice:** Notice three times today when you feel any level of anxiety. Just notice - no judgment, no fixing. Simply acknowledge: "There''s anxiety."', 5),

(2, '## Fight, Flight, Freeze

When your brain perceives threat, it triggers automatic responses:

- **Fight:** Tension, irritability, wanting to confront
- **Flight:** Urge to escape, restlessness, avoidance
- **Freeze:** Feeling stuck, mind going blank, numbness

These aren''t choices - they''re automatic survival responses.

**Practice:** Think about a recent anxious moment. Which response showed up? Again, no judgment - just curiosity.', 5),

(3, '## Breathing: Your Portable Reset

Slow, deep breathing signals safety to your nervous system. It''s the one automatic function you can consciously control.

**Technique: 4-7-8 Breathing**
1. Inhale through nose for 4 counts
2. Hold for 7 counts
3. Exhale through mouth for 8 counts
4. Repeat 3-4 times

**Practice:** Try this technique once today, ideally when you''re relatively calm. Building the skill when not anxious makes it easier to use when you are.', 6),

(4, '## Grounding: Anchor to Now

Anxiety often pulls us into feared futures or regretted pasts. Grounding brings you back to the only moment that exists: now.

**5-4-3-2-1 Technique:**
- 5 things you can SEE
- 4 things you can TOUCH
- 3 things you can HEAR
- 2 things you can SMELL
- 1 thing you can TASTE

**Practice:** Use this technique once today. Notice how your anxiety level shifts.', 5),

(5, '## Thoughts Are Not Facts

Your mind generates thousands of thoughts daily. Many are automatic, repetitive, and not particularly accurate. Anxious thoughts feel true but aren''t necessarily so.

**Key insight:** You can observe your thoughts without believing them or acting on them.

**Practice:** When you notice an anxious thought today, try silently saying: "I notice I''m having the thought that..." This creates helpful distance.', 5),

(6, '## Self-Compassion: Not Weakness

Research shows self-criticism increases anxiety and depression, while self-compassion builds resilience.

**Three components:**
1. **Mindfulness:** Acknowledging difficulty without over-identifying
2. **Common humanity:** Remembering suffering is universal
3. **Self-kindness:** Treating yourself as you''d treat a friend

**Practice:** When you notice self-criticism today, pause and ask: "What would I say to a friend feeling this way?"', 6),

(7, '## Week 1: What You''ve Learned

Congratulations on completing your first week!

**You now know:**
- Anxiety is a normal protective response
- Fight-flight-freeze happens automatically
- Breathing can activate your calming system
- Grounding anchors you to the present
- Thoughts can be observed, not obeyed
- Self-compassion supports healing

**Review practice:** Which technique resonated most? Use it at least once today.', 4),

(8, '## Cognitive Distortions

Our minds have predictable patterns of inaccurate thinking. Recognizing these can help you question anxious thoughts.

**Common distortions:**
- **Catastrophizing:** Assuming the worst
- **Mind reading:** Assuming you know what others think
- **Fortune telling:** Predicting negative outcomes
- **All-or-nothing:** Black and white thinking
- **Should statements:** Rigid rules creating pressure

**Practice:** Notice if any of these show up in your thinking today.', 6),

(9, '## Questioning Anxious Thoughts

Once you spot distortions, you can gently examine them.

**Helpful questions:**
- What''s the evidence for and against this thought?
- What would I tell a friend thinking this?
- What''s a more balanced way to see this?
- Will this matter in a year?

**Practice:** Choose one anxious thought and work through these questions.', 7),

(10, '## Worry Time

Trying not to worry often backfires. Instead, try containing worry to designated times.

**How it works:**
1. Choose a daily 15-30 minute "worry time"
2. When worries arise outside this time, note them briefly and postpone
3. During worry time, address your list - or notice many worries have faded

**Practice:** Try this technique for the next few days.', 6),

(11, '## Progressive Muscle Relaxation

Anxiety creates physical tension you may not even notice. PMR helps release it systematically.

**Basic technique:**
1. Tense a muscle group for 5 seconds
2. Release and notice the contrast for 10 seconds
3. Move through body: feet, calves, thighs, abdomen, hands, arms, shoulders, face

**Practice:** Try a brief PMR session today, even just hands and shoulders.', 8),

(12, '## Mindful Awareness

Mindfulness isn''t about clearing your mind - it''s about noticing what''s there without judgment.

**Key principles:**
- Present moment focus
- Non-judgmental awareness
- Curiosity over criticism
- Returning attention when it wanders (this IS the practice)

**Practice:** Spend 3 minutes just noticing your breath. When your mind wanders, gently return.', 6),

(13, '## Your Values

Anxiety can shrink your world. Reconnecting with values expands it again.

**Value areas to consider:**
- Relationships
- Work/contribution
- Personal growth
- Health/wellbeing
- Fun/creativity
- Spirituality/meaning

**Practice:** Identify 2-3 values that matter deeply to you. How might anxiety be getting in the way?', 7),

(14, '## Week 2 Review

Another week complete!

**New tools:**
- Recognizing cognitive distortions
- Questioning anxious thoughts
- Containing worry with worry time
- Progressive muscle relaxation
- Mindful awareness
- Values clarification

**Reflection:** How is your relationship with anxiety shifting?', 5),

(15, '## Understanding Avoidance

Avoidance provides short-term relief but long-term maintenance of anxiety. It teaches your brain that the avoided situation was actually dangerous.

**Common avoidance patterns:**
- Obvious: Not going places, not doing things
- Subtle: Always having an escape plan, only going with "safe" people
- Mental: Distraction, thought suppression

**Practice:** Notice one thing you might be avoiding. No pressure to change it yet.', 6),

(16, '## Gentle Exposure

Exposure means gradually approaching what you''ve avoided, allowing anxiety to naturally decrease.

**Principles:**
- Start small
- Stay in the situation until anxiety decreases
- Repeat
- Gradually increase challenge

**Practice:** Identify one very small step toward something you''ve been avoiding. Consider trying it this week.', 7),

(17, '## Safety Behaviors

These are subtle actions we take to manage anxiety that actually maintain it.

**Examples:**
- Rehearsing what to say before social situations
- Sitting near exits
- Checking for reassurance
- Over-preparing
- Using phone to look busy

**Practice:** Notice if you use any safety behaviors. What would happen if you didn''t?', 6),

(18, '## Making Room for Discomfort

Fighting anxiety often intensifies it. Acceptance doesn''t mean liking anxiety - it means stopping the war.

**Key insight:** You can feel anxious AND still do meaningful things.

**Practice:** When anxiety arises today, try saying "I notice anxiety is here" and continuing with what matters.', 6),

(19, '## Defusion Techniques

Defusion creates space between you and your thoughts.

**Techniques:**
- "I notice I''m having the thought that..."
- Sing anxious thoughts to "Happy Birthday" tune
- Say thoughts in a cartoon voice
- Thank your mind for its "helpful" input
- Imagine thoughts as leaves floating by on a stream

**Practice:** Try one defusion technique with an anxious thought today.', 6),

(20, '## Body Scan

Anxiety lives in the body. The body scan develops interoceptive awareness.

**Basic practice:**
1. Lie down or sit comfortably
2. Slowly move attention through body
3. Notice sensations without trying to change them
4. Breathe into areas of tension

**Practice:** Try a 5-10 minute body scan today.', 8),

(21, '## Week 3 Integration

You''re building a sophisticated toolkit.

**This week''s additions:**
- Understanding avoidance patterns
- Gentle exposure principles
- Recognizing safety behaviors
- Acceptance over struggle
- Defusion techniques
- Body scan practice

**Reflection:** Which approach feels most useful for your specific anxiety patterns?', 5),

(22, '## Sleep and Anxiety

Sleep and anxiety have a bidirectional relationship - each affects the other.

**Sleep hygiene basics:**
- Consistent sleep/wake times
- Cool, dark room
- No screens 1 hour before bed
- Limit caffeine after noon
- Process the day before bed, not in bed

**Practice:** Choose one sleep hygiene improvement to implement this week.', 6),

(23, '## Lifestyle Factors

Several lifestyle factors influence anxiety levels.

**Evidence-based impacts:**
- Regular movement reduces anxiety
- Caffeine and alcohol can increase it
- Blood sugar fluctuations affect mood
- Social connection is protective
- Nature exposure calms the nervous system

**Practice:** Identify one lifestyle factor you could adjust. Start small.', 6),

(24, '## Social Anxiety Tools

Social anxiety involves fear of negative evaluation by others.

**Specific strategies:**
- Shift focus from self to others
- Ask questions (people like talking about themselves)
- Accept imperfection - "good enough" is enough
- Notice your predictions vs. what actually happens
- Post-event processing: facts only, no rumination

**Practice:** Try shifting focus outward in one social interaction today.', 7),

(25, '## Responding to Panic

Panic attacks are intense but not dangerous. They typically peak within 10 minutes and subside.

**During panic:**
- Remember: uncomfortable but not dangerous
- Don''t fight or flee - ride the wave
- Use slow breathing (especially long exhales)
- Ground yourself with 5-4-3-2-1
- Stay in the situation if possible

**Practice:** Review this list. Consider keeping it accessible.', 6),

(26, '## Building Resilience

Resilience isn''t about not feeling anxious - it''s about bouncing back and continuing.

**Resilience factors:**
- Accepting uncertainty as part of life
- Flexible thinking
- Strong social connections
- Self-compassion
- Sense of meaning/purpose
- Taking valued action despite fear

**Practice:** Reflect on which resilience factors you want to strengthen.', 6),

(27, '## Support Systems

You don''t have to manage anxiety alone.

**Types of support:**
- Professional: therapist, psychiatrist, doctor
- Personal: trusted friends, family, support groups
- Self-help: apps, books, courses (like this one)

**When to seek professional help:**
- Anxiety significantly impacts daily life
- Self-help isn''t sufficient
- You''re using substances to cope
- You have thoughts of self-harm

**Practice:** Identify your current support system. Are there gaps?', 7),

(28, '## Your Maintenance Plan

Sustainable change requires ongoing practice, not just crisis management.

**Plan elements:**
- Daily: Brief mindfulness, breathing practice
- Weekly: Check in with feelings, review progress
- As needed: Use specific tools for specific situations
- Regular: Continue valued activities despite anxiety

**Practice:** Draft your personal maintenance plan.', 7),

(29, '## When Anxiety Returns

Setbacks are normal and expected. They''re not failure - they''re part of recovery.

**Setback strategies:**
- Normalize it: "This is a setback, not a collapse"
- Don''t abandon your tools - use them
- Identify triggers if possible
- Return to basics: breathing, grounding
- Practice self-compassion
- Consider whether you need additional support

**Practice:** Write yourself a brief note to read during future setbacks.', 6),

(30, '## Celebrating Your Journey

You''ve completed 30 days of anxiety skill-building. This is meaningful.

**What you''ve gained:**
- Understanding of anxiety
- Multiple practical tools
- A framework for ongoing growth
- Evidence that you can show up even when anxious

**Looking ahead:**
- Continue practicing
- Be patient with yourself
- Remember: progress isn''t linear
- You have what you need

Congratulations. Keep going.', 5)
ON CONFLICT DO NOTHING;

-- Seed cosmetics (reward shop items)
INSERT INTO cosmetics (name, cost, image_url, description, sort_order) VALUES
('Calm Sky Background', 50, '/cosmetics/calm-sky.png', 'A peaceful sky gradient for your profile', 1),
('Gentle Rain Theme', 75, '/cosmetics/gentle-rain.png', 'Soft rain animation for your dashboard', 2),
('Mountain Serenity', 100, '/cosmetics/mountain.png', 'Majestic mountain landscape theme', 3),
('Forest Retreat', 100, '/cosmetics/forest.png', 'Peaceful forest backdrop', 4),
('Ocean Waves', 125, '/cosmetics/ocean.png', 'Calming ocean waves theme', 5),
('Sunrise Glow', 150, '/cosmetics/sunrise.png', 'Warm sunrise color scheme', 6),
('Starry Night', 150, '/cosmetics/starry.png', 'Peaceful night sky theme', 7),
('Garden Peace', 200, '/cosmetics/garden.png', 'Beautiful garden landscape', 8),
('Northern Lights', 250, '/cosmetics/aurora.png', 'Stunning aurora borealis theme', 9),
('Zen Stone', 300, '/cosmetics/zen.png', 'Minimalist zen garden theme', 10)
ON CONFLICT DO NOTHING;
