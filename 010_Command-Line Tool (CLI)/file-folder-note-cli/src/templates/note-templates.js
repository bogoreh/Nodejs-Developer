import chalk from 'chalk';

/**
 * Pre-defined note templates for different use cases
 */
export const NOTE_TEMPLATES = {
  meeting: {
    name: '📅 Meeting Notes',
    template: (title, attendees = []) => `# Meeting: ${title}

## 📋 Meeting Details
- **Date:** ${new Date().toLocaleDateString()}
- **Time:** ${new Date().toLocaleTimeString()}
- **Attendees:** ${attendees.length ? attendees.join(', ') : '_________________'}

## 📝 Agenda
1. 
2. 
3. 

## 💬 Discussion Points
- 
- 
- 

## ✅ Action Items
- [ ] 
- [ ] 
- [ ] 

## 📌 Next Steps
- 
- 

## 📎 Additional Notes
`
  },

  todo: {
    name: '✅ Todo List',
    template: (title) => `# Todo: ${title}

## 🎯 Goals
- [ ] 
- [ ] 
- [ ] 

## 📅 Today's Tasks
- [ ] 
- [ ] 
- [ ] 

## 🔜 Upcoming Tasks
- [ ] 
- [ ] 
- [ ] 

## 💡 Ideas / Notes
`
  },

  idea: {
    name: '💡 Idea / Brainstorm',
    template: (title) => `# Idea: ${title}

## 🔍 Overview
[Brief description of the idea]

## 🎨 Concept
[Detailed explanation of the concept]

## 📊 Potential Impact
- **Target Audience:** 
- **Market Potential:** 
- **Timeline:** 

## ⚙️ Implementation Ideas
1. 
2. 
3. 

## ✅ Pros
- 
- 
- 

## ❌ Cons / Challenges
- 
- 
- 

## 🔗 Resources / References
- 
- 
`
  },

  project: {
    name: '📊 Project Plan',
    template: (title) => `# Project: ${title}

## 🎯 Project Overview
**Start Date:** ${new Date().toLocaleDateString()}
**Target End Date:** 
**Status:** 🟡 In Progress

## 👥 Team Members
- **Project Lead:** 
- **Team Members:** 
- **Stakeholders:** 

## 📋 Objectives
1. 
2. 
3. 

## 📅 Milestones
- [ ] **Milestone 1** - Due: 
  - Tasks:
    - [ ] 
    - [ ] 
- [ ] **Milestone 2** - Due: 
  - Tasks:
    - [ ] 
    - [ ] 

## 🔧 Resources Needed
- 
- 

## 📈 Success Metrics
- 
- 

## ⚠️ Risks and Mitigations
| Risk | Impact | Mitigation |
|------|--------|------------|
|      |        |            |
|      |        |            |

## 📝 Meeting Notes
### ${new Date().toLocaleDateString()} - Kickoff
- 
- 
`
  },

  journal: {
    name: '📔 Daily Journal',
    template: (title) => `# Journal: ${title} - ${new Date().toLocaleDateString()}

## 🌅 Morning Reflection
**Mood:** 
**Energy Level:** /10
**Goals for today:**
- 
- 
- 

## 📝 Daily Log
### ${new Date().toLocaleTimeString()} - 
- 
- 

### ${new Date().toLocaleTimeString()} - 
- 
- 

## 🌟 Highlights of the Day
- 
- 
- 

## 💭 Lessons Learned
- 
- 
- 

## 🙏 Gratitude
1. 
2. 
3. 

## 🌙 Evening Reflection
**Accomplishments:**
- 
- 
- 

**Tomorrow's priorities:**
- 
- 
- 
`
  },

  research: {
    name: '🔬 Research Notes',
    template: (title) => `# Research: ${title}

## 🔍 Research Question
[Main research question or hypothesis]

## 📚 Sources
### Source 1: [Title]
- **Author:** 
- **Publication:** 
- **Date:** 
- **Key Points:**
  - 
  - 
  - 

### Source 2: [Title]
- **Author:** 
- **Publication:** 
- **Date:** 
- **Key Points:**
  - 
  - 
  - 

## 📊 Key Findings
- 
- 
- 

## 💡 Insights
- 
- 
- 

## ❓ Open Questions
- 
- 
- 

## 📝 Conclusions
[Summary of research findings]

## 🔗 References
1. 
2. 
3. 
`
  },

  learning: {
    name: '📚 Learning Notes',
    template: (title) => `# Learning: ${title}

## 🎯 Learning Objectives
- 
- 
- 

## 📖 Key Concepts
### Concept 1: 
- Definition: 
- Example: 
- Notes: 

### Concept 2: 
- Definition: 
- Example: 
- Notes: 

## 💻 Code Examples / Practice
\`\`\`

\`\`\`

## 📝 Summary
[Brief summary of what you learned]

## ✅ Key Takeaways
- 
- 
- 

## 🔜 Next Steps
- [ ] Review concept 1
- [ ] Practice exercise
- [ ] Research related topics

## 📚 Additional Resources
- 
- 
`
  },

  feedback: {
    name: '💬 Feedback / Review',
    template: (title) => `# Feedback: ${title}

## 📋 Overview
**Subject:** 
**Date:** ${new Date().toLocaleDateString()}
**Reviewer:** 

## ⭐ Rating
- **Overall:** /10
- **Strengths:** /10
- **Areas for Improvement:** /10

## ✅ What Went Well
1. 
   - Evidence: 
   - Impact: 
2. 
   - Evidence: 
   - Impact: 

## 🔧 Areas for Improvement
1. 
   - Suggestion: 
   - Action plan: 
2. 
   - Suggestion: 
   - Action plan: 

## 🎯 Action Items
- [ ] 
- [ ] 
- [ ] 

## 📅 Follow-up Date
[Date for next review]

## 💭 Additional Comments
`
  },

  recipe: {
    name: '🍳 Recipe',
    template: (title) => `# Recipe: ${title}

## 📋 Overview
- **Prep Time:** 
- **Cook Time:** 
- **Total Time:** 
- **Servings:** 
- **Difficulty:** 

## 🥘 Ingredients
### Main Ingredients
- [ ] 
- [ ] 
- [ ] 

### Seasonings
- [ ] 
- [ ] 
- [ ] 

### Garnish
- [ ] 
- [ ] 

## 📝 Instructions
1. 
   - 
2. 
   - 
3. 
   - 

## 💡 Tips & Tricks
- 
- 

## 📊 Nutrition Information
- Calories: 
- Protein: 
- Carbs: 
- Fat: 

## 📸 Photos
[Attach photos here]

## ⭐ Rating
/5
`
  },

  workout: {
    name: '💪 Workout Log',
    template: (title) => `# Workout: ${title}

## 📅 Workout Details
**Date:** ${new Date().toLocaleDateString()}
**Time:** 
**Duration:** 
**Type:** 

## 🔥 Warm-up
- [ ] Exercise 1: ___ reps/sets
- [ ] Exercise 2: ___ reps/sets
- [ ] Exercise 3: ___ reps/sets

## 💪 Main Workout
### Exercise 1: 
- Sets: 
- Reps: 
- Weight: 
- Notes: 

### Exercise 2: 
- Sets: 
- Reps: 
- Weight: 
- Notes: 

### Exercise 3: 
- Sets: 
- Reps: 
- Weight: 
- Notes: 

## 🧘 Cool-down
- [ ] Stretch 1: ___ seconds
- [ ] Stretch 2: ___ seconds
- [ ] Stretch 3: ___ seconds

## 📊 Performance Notes
- Energy Level: /10
- Difficulty: /10
- Achievements: 
- Areas to improve: 

## 💭 Reflections
- What went well:
- What could be better:
- Goals for next time:
`
  }
};

/**
 * Get a template by category
 * @param {string} category - The template category
 * @param {string} title - The note title
 * @param {Array} attendees - Optional attendees for meeting template
 * @returns {string} The formatted template
 */
export const getTemplateByCategory = (category, title, attendees = []) => {
  const templateMap = {
    work: NOTE_TEMPLATES.meeting,
    personal: NOTE_TEMPLATES.journal,
    idea: NOTE_TEMPLATES.idea,
    todo: NOTE_TEMPLATES.todo,
    project: NOTE_TEMPLATES.project,
    research: NOTE_TEMPLATES.research,
    learning: NOTE_TEMPLATES.learning,
    feedback: NOTE_TEMPLATES.feedback,
    recipe: NOTE_TEMPLATES.recipe,
    workout: NOTE_TEMPLATES.workout,
    other: NOTE_TEMPLATES.learning
  };

  const selectedTemplate = templateMap[category] || NOTE_TEMPLATES.learning;
  return selectedTemplate.template(title, attendees);
};

/**
 * Get all available template names for display
 * @returns {Array} List of template names with emojis
 */
export const getTemplateNames = () => {
  return Object.values(NOTE_TEMPLATES).map(template => template.name);
};

/**
 * Create a custom template
 * @param {Object} config - Template configuration
 * @returns {Object} Custom template object
 */
export const createCustomTemplate = (config) => {
  const { name, sections = [] } = config;
  
  const template = (title) => {
    let content = `# ${title}\n\n`;
    
    sections.forEach(section => {
      content += `## ${section.title}\n`;
      if (section.type === 'list') {
        content += '- \n'.repeat(section.lines || 3);
      } else if (section.type === 'checklist') {
        content += '- [ ] \n'.repeat(section.lines || 3);
      } else if (section.type === 'table') {
        content += `| ${section.columns.join(' | ')} |\n`;
        content += `|${section.columns.map(() => '---').join('|')}|\n`;
        content += '|   |\n'.repeat(section.rows || 3);
      } else {
        content += '\n\n';
      }
      content += '\n';
    });
    
    return content;
  };
  
  return {
    name,
    template
  };
};

/**
 * Quick note template for rapid note-taking
 */
export const quickNoteTemplate = (title) => {
  return `# ${title}

## 📝 Quick Notes
- 
- 
- 

## ✅ Action Items
- [ ] 
- [ ] 

## 📅 Follow-up
- Next steps: 
- Due date: 
`;
};

/**
 * Export all templates with descriptions
 */
export const templateDescriptions = {
  meeting: 'Structured meeting notes with agenda, discussion points, and action items',
  todo: 'Task management template with goals and priorities',
  idea: 'Brainstorming template for capturing and developing ideas',
  project: 'Comprehensive project planning template',
  journal: 'Daily journal for reflections and planning',
  research: 'Research notes with sources and findings',
  learning: 'Educational notes with concepts and practice',
  feedback: 'Structured feedback and review template',
  recipe: 'Cooking recipe with ingredients and instructions',
  workout: 'Fitness tracking template'
};