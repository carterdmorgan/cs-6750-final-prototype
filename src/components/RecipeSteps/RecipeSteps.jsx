import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './RecipeSteps.css'

// A function to help with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

// The initial steps
const initialSteps = [
  { id: 'step-1', content: 'e.g. Preheat oven to 350 degrees F...', isHeader: false },
  { id: 'step-2', content: 'e.g. Combine all dry ingredients in a large bowl...', isHeader: false },
  { id: 'step-3', content: 'e.g. Pour into greased trays and bake for 15-20 minutes...', isHeader: false },
];

const RecipeSteps = () => {
  const [steps, setSteps] = useState(initialSteps);

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const items = reorder(
      steps,
      result.source.index,
      result.destination.index
    );

    setSteps(items);
  };

  const getStepNumber = (currentStepId) => {
    // Filter out the headers from the steps
    const nonHeaderSteps = steps.filter(step => !step.isHeader);
    // Find the index of the current step in the array of non-header steps
    const stepIndex = nonHeaderSteps.findIndex(step => step.id === currentStepId);
    // The step number is the index + 1 (since array indices start at 0)
    return stepIndex + 1;
  };

  const handleStepChange = (e, index) => {
    // Create a new array with the updated step content
    const newSteps = steps.map((step, i) => {
      if (index === i) {
        return { ...step, content: e.target.value };
      }
      return step;
    });
    setSteps(newSteps);
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="recipe-steps">
        <h2>Directions</h2>
        <p>Explain how to make your recipe, including oven temperatures, baking or cooking times, and pan sizes, etc. Use optional headers to organize the different parts of the recipe (i.e. Prep, Bake, Decorate).</p>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {steps.map((step, index) => (
                <Draggable key={step.id} draggableId={step.id} index={index}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                      <div>{step.isHeader ? 'Header' : `Step ${getStepNumber(step.id)}`}</div>
                      <div className={`step ${step.isHeader ? 'header' : ''}`}>
                        <span id="drag-icon">::</span>
                        <input type="text" value={step.content} onChange={(e) => handleStepChange(e, index)} />
                        <button onClick={() => setSteps(steps.filter(s => s.id !== step.id))}>×</button>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <button onClick={() => setSteps([...steps, { id: `step-${steps.length + 1}`, content: 'Add another step' }])}>+ ADD STEP</button>
        <button onClick={() => setSteps([...steps, { id: `step-${steps.length + 1}`, content: 'Add a header, e.g. Prep', isHeader: true }])}>+ ADD HEADER</button>
        {/* Handle adding headers similarly */}
      </div>
    </DragDropContext>
  );
};

export default RecipeSteps;
