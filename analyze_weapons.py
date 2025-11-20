import pandas as pd

def analyze_elden_ring_weapons():
    # Read the CSV
    # The file has duplicate column names (Phy, Mag, etc. for both Attack and Defense)
    # pandas will automatically rename duplicates to name.1, name.2, etc.
    try:
        df = pd.read_csv('elden_ring_weapon.csv')
        
        # Rename columns for clarity
        # The first set is Attack, the second (which pandas likely named .1) is Guard/Defense
        rename_map = {
            'Phy': 'Phy_Attack',
            'Mag': 'Mag_Attack', 
            'Fir': 'Fire_Attack',
            'Lit': 'Light_Attack',
            'Hol': 'Holy_Attack',
            'Phy.1': 'Phy_Guard',
            'Mag.1': 'Mag_Guard',
            'Fir.1': 'Fire_Guard',
            'Lit.1': 'Light_Guard',
            'Hol.1': 'Holy_Guard'
        }
        df = df.rename(columns=rename_map)
        
        print("--- ELDEN RING WEAPON ANALYSIS ---\n")
        
        # 1. Count unique weapon types
        print(f"Total Weapons: {len(df)}")
        print(f"Unique Weapon Types: {df['Type'].nunique()}")
        print("Most Common Types:")
        print(df['Type'].value_counts().head(5))
        print("\n" + "="*40 + "\n")

        # 2. Top 5 Weapons by Physical Attack
        # Ensure the column is numeric (replace '-' with 0 if necessary)
        df['Phy_Attack'] = pd.to_numeric(df['Phy_Attack'], errors='coerce').fillna(0)
        
        print("TOP 5 WEAPONS BY PHYSICAL DAMAGE:")
        top_phy = df.sort_values(by='Phy_Attack', ascending=False).head(5)
        print(top_phy[['Name', 'Type', 'Phy_Attack']].to_string(index=False))
        print("\n" + "="*40 + "\n")

        # 3. Heaviest Weapons
        print("HEAVIEST WEAPONS:")
        top_heavy = df.sort_values(by='Wgt', ascending=False).head(5)
        print(top_heavy[['Name', 'Type', 'Wgt']].to_string(index=False))
        
    except FileNotFoundError:
        print("Error: 'elden_ring_weapon.csv' not found in the current directory.")
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    analyze_elden_ring_weapons()

    df = pd.read_csv('elden_ring_weapon.csv')
    print(df.head())

