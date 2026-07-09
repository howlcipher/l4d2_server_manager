package main

import (
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

const RepoURL = "https://github.com/howlcipher/l4d2_server_manager.git"

func main() {
	if len(os.Args) < 2 {
		printUsage()
		os.Exit(1)
	}

	command := os.Args[1]
	homeDir, err := os.UserHomeDir()
	if err != nil {
		fmt.Printf("Error getting home directory: %v\n", err)
		os.Exit(1)
	}

	targetDir := filepath.Join(homeDir, "l4d2-server-manager")

	switch command {
	case "install":
		install(targetDir)
	case "update":
		update(targetDir)
	case "uninstall":
		uninstall(targetDir)
	default:
		printUsage()
		os.Exit(1)
	}
}

func printUsage() {
	fmt.Println("L4D2 Server Manager CLI")
	fmt.Println("Usage:")
	fmt.Println("  l4d2-manager install   - Clones and installs the server manager")
	fmt.Println("  l4d2-manager update    - Pulls the latest code and rebuilds")
	fmt.Println("  l4d2-manager uninstall - Stops the manager and removes all files")
}

func runCmd(dir string, name string, args ...string) error {
	cmd := exec.Command(name, args...)
	cmd.Dir = dir
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	return cmd.Run()
}

func install(targetDir string) {
	fmt.Println("==> Starting Installation...")

	if _, err := os.Stat(targetDir); !os.IsNotExist(err) {
		fmt.Printf("Directory %s already exists. Please run 'update' instead.\n", targetDir)
		return
	}

	// Make sure git is installed
	if err := runCmd(".", "git", "--version"); err != nil {
		fmt.Println("Git is not installed. Attempting to install git...")
		runCmd(".", "sudo", "apt-get", "update")
		runCmd(".", "sudo", "apt-get", "install", "-y", "git")
	}

	fmt.Println("==> Cloning repository...")
	if err := runCmd(".", "git", "clone", RepoURL, targetDir); err != nil {
		fmt.Printf("Failed to clone repository: %v\n", err)
		return
	}

	fmt.Println("==> Running setup script...")
	if err := runCmd(targetDir, "bash", "setup.sh"); err != nil {
		fmt.Printf("Setup script failed: %v\n", err)
		return
	}

	fmt.Println("==> Installation Complete! The server manager is running in the background via PM2.")
	fmt.Println("Access it at: http://<your-server-ip>:3000")
}

func update(targetDir string) {
	fmt.Println("==> Updating L4D2 Server Manager...")

	if _, err := os.Stat(targetDir); os.IsNotExist(err) {
		fmt.Println("Not installed. Please run 'install' first.")
		return
	}

	fmt.Println("==> Pulling latest changes from GitHub...")
	if err := runCmd(targetDir, "git", "pull", "origin", "main"); err != nil {
		fmt.Printf("Failed to pull latest changes: %v\n", err)
		return
	}

	fmt.Println("==> Installing dependencies...")
	runCmd(targetDir, "npm", "install")

	fmt.Println("==> Building Next.js application...")
	runCmd(targetDir, "npm", "run", "build")

	fmt.Println("==> Restarting PM2 process...")
	runCmd(targetDir, "npx", "pm2", "restart", "l4d2-manager")

	fmt.Println("==> Update Complete!")
}

func uninstall(targetDir string) {
	fmt.Println("==> Uninstalling L4D2 Server Manager...")

	if _, err := os.Stat(targetDir); os.IsNotExist(err) {
		fmt.Println("Not installed. Nothing to uninstall.")
		return
	}

	fmt.Println("==> Stopping PM2 process...")
	runCmd(targetDir, "npx", "pm2", "delete", "l4d2-manager")

	fmt.Println("==> Removing directory...")
	if err := os.RemoveAll(targetDir); err != nil {
		fmt.Printf("Failed to remove directory: %v\n", err)
		return
	}

	fmt.Println("==> Uninstallation Complete!")
}
