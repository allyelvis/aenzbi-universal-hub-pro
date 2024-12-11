import express from 'express';
import { Project } from '../entities/Project';
import { initializeDatabase } from '../config/database';

const app = express();
app.use(express.json());

// Initialize database connection
initializeDatabase();

app.get('/projects', async (req, res) => {
  try {
    const projects = await Project.find();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.post('/projects', async (req, res) => {
  try {
    const project = Project.create(req.body);
    await project.save();
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.get('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findOne(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.put('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findOne(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    Project.merge(project, req.body);
    await project.save();
    res.json(project);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.delete('/projects/:id', async (req, res) => {
  try {
    const project = await Project.findOne(req.params.id);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await project.remove();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

const PORT = process.env.PORT || 3003;
app.listen(PORT, () => {
  console.log();
});
