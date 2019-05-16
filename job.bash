#!/bin/bash
#SBATCH --job-name=inv.cu
#SBATCH --output=output/slurm.log
#SBATCH --ntasks-per-node=1
#SBATCH --nodes=1
#SBATCH --time=00:00:10
#SBATCH --gres=gpu:1

srun ./inv.out