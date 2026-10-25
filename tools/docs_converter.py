import re

def process_markdown(input_path, output_path):
    with open(input_path, 'r', encoding='utf-8') as file:
        lines = file.readlines()

    # STEP 1: Initial line-by-line cleaning
    clean_lines = []
    for line in lines:
        clean = line.rstrip('\n')
        # Remove backslashes
        clean = clean.replace('\\', '')
        
        # Replace ![alt][ref] with ![alt](assets/ref.png)
        clean = re.sub(r'!\[([^\]]*)\]\[([^\]]*)\]', r'![\1](assets/\2.png)', clean)
        
        # Replace "* " bullets with "- " 
        clean = re.sub(r'^( *)\* ', r'\1- ', clean)
        
        clean_lines.append(clean)

    # STEP 2: Process blank lines with context (looking ahead and behind)
    processed_lines = []
    
    for i, line in enumerate(clean_lines):
        if line.strip() == '':
            # Look backward for the closest non-blank line
            prev_is_header = False
            prev_is_list = False
            for j in range(i - 1, -1, -1):
                if clean_lines[j].strip() != '':
                    prev_is_header = bool(re.match(r'^\s*#{1,6} ', clean_lines[j]))
                    # Matches -, +, *, or numbers (like 1.)
                    prev_is_list = bool(re.match(r'^\s*([-+*]|\d+\.) ', clean_lines[j]))
                    break
            
            # Look forward for the closest non-blank line
            next_is_header = False
            next_is_list = False
            for j in range(i + 1, len(clean_lines)):
                if clean_lines[j].strip() != '':
                    next_is_header = bool(re.match(r'^\s*#{1,6} ', clean_lines[j]))
                    next_is_list = bool(re.match(r'^\s*([-+*]|\d+\.) ', clean_lines[j]))
                    break
            
            # It's the start of a list if the next line is a list item, 
            # but the previous line is NOT a list item
            is_start_of_list = next_is_list and not prev_is_list

            # Check all conditions to DROP this blank line entirely
            if prev_is_header or next_is_header or is_start_of_list:
                continue 
            else:
                # If none of the drop conditions are met, it becomes a thematic break
                processed_lines.append('---')
        else:
            processed_lines.append(line)

    # STEP 3: Add a blank line between all lines
    final_output = '\n\n'.join(processed_lines)

    # Write the result to the output file
    with open(output_path, 'w', encoding='utf-8') as file:
        file.write(final_output + '\n')
        
    print(f"Success! Processed file saved to: {output_path}")

# Example usage:
if __name__ == "__main__":
    # Replace these filenames with your actual file paths
    input_filename = 'input.md'
    output_filename = 'output.md'
    
    process_markdown(input_filename, output_filename)