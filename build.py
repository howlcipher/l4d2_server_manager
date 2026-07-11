#!/usr/bin/env python3
import os
import sys
import json
import shutil
import glob
from pathlib import Path

def load_config(config_path="config.json"):
    with open(config_path, "r") as f:
        return json.load(f)

def build_server():
    print("Starting L4D2 Server Build Process...")
    config = load_config()
    source_base = Path(config["source_directory"]).resolve()
    build_base = Path(config["build_directory"]).resolve()

    # Clean existing build directory
    if build_base.exists():
        print(f"Cleaning existing build directory: {build_base}")
        shutil.rmtree(build_base)
    
    # Process each module defined in config
    for module_name, module_info in config["modules"].items():
        print(f"\nProcessing {module_name}...")
        target_dir = build_base / module_info["target_dir"]
        target_dir.mkdir(parents=True, exist_ok=True)
        
        file_types = module_info.get("file_types", ["*.*"])
        
        for source in module_info["sources"]:
            src_dir = source_base / source
            if not src_dir.exists():
                print(f"  [WARNING] Source directory not found: {src_dir}")
                continue
            
            # Find and copy files
            copied_count = 0
            for file_type in file_types:
                # Use recursive globbing to find files in subdirectories too
                for matched_file in src_dir.rglob(file_type):
                    if matched_file.is_file():
                        # Determine relative path to maintain structure if needed,
                        # or just flatten. For plugins/extensions, flattening is usually fine,
                        # but some configs might need subdirs. We'll flatten for extensions/plugins,
                        # but keep it if there are subdirectories? Let's just flatten to the target dir.
                        dest_file = target_dir / matched_file.name
                        shutil.copy2(matched_file, dest_file)
                        copied_count += 1
                        
            print(f"  Copied {copied_count} files from '{source}'")

    print("\n✅ Build completed successfully!")
    print(f"Server files are available in: {build_base}")
    print("You can now copy these files to your L4D2 server installation.")

if __name__ == "__main__":
    build_server()
