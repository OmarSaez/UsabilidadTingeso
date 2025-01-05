package edu.mtisw.prestabank_backend.Service;

import edu.mtisw.prestabank_backend.Entity.UserEntity;
import edu.mtisw.prestabank_backend.Repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Service
public class UserService {

    @Autowired
    UserRepository userRepository;

    private static final Logger logger = LoggerFactory.getLogger(UserService.class); //MEnsaje por cosnla

    public ArrayList<UserEntity> getUsers() {return (ArrayList<UserEntity>) userRepository.findAll(); }

    public UserEntity saveUser(UserEntity user){

        UserEntity exists1 = userRepository.findUserByEmail(user.getEmail());
        UserEntity exists2 = userRepository.findByRut(user.getRut());
        if (exists1 != null || exists2 != null){
            logger.info("--Se evaluo la situacion y el usuario ya existe");
            return null;
        }
        logger.info("--Se evaluo la situacion y se guardo el user");
        return userRepository.save(user);}

    public UserEntity getUserById(Long id){return userRepository.findById(id).get();}

    public UserEntity getUserByRut(String rut){return  userRepository.findByRut(rut);}

    public UserEntity getUserByEmail(String email){return  userRepository.findUserByEmail(email);}

    public UserEntity updateUser(UserEntity user){return userRepository.save(user);}

    public boolean deleteUser(Long id) throws Exception{
        try{
            userRepository.deleteById(id);
            return true;
        } catch (Exception e){
            throw new Exception(e.getMessage());
        }
    }
}
